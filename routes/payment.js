const express = require('express');
const router = express.Router();
const axios = require('axios');
const { isAuthenticated, isClient } = require('../middleware/auth');
const User = require('../models/User');
const Property = require('../models/Property');

// Initialize payment
router.post('/initialize', isAuthenticated, isClient, async (req, res) => {
  try {
    const { propertyId } = req.body;
    const property = await Property.findById(propertyId).populate('agent');

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check if client has already unlocked this agent
    const client = await User.findById(req.session.user._id);
    if (client.unlockedAgents.includes(property.agent._id)) {
      return res.status(400).json({ error: 'Agent already unlocked' });
    }

    const paymentData = {
      email: req.session.user.email,
      amount: 200000, // ₦2,000 in kobo
      currency: 'NGN',
      reference: `unlock_${Date.now()}_${req.session.user._id}`,
      callback_url: `${req.protocol}://${req.get('host')}/payment/callback`,
      metadata: {
        propertyId: propertyId,
        agentId: property.agent._id.toString(),
        clientId: req.session.user._id
      }
    };

    const response = await axios.post('https://api.paystack.co/transaction/initialize', paymentData, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      success: true,
      data: response.data.data
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

// Payment callback
router.get('/callback', async (req, res) => {
  try {
    const { reference } = req.query;

    // Verify payment
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });

    const { data } = response.data;

    if (data.status === 'success') {
      const { propertyId, agentId, clientId } = data.metadata;

      // Update client's unlocked agents
      await User.findByIdAndUpdate(clientId, {
        $addToSet: { unlockedAgents: agentId },
        $push: {
          paymentHistory: {
            amount: data.amount / 100, // Convert from kobo to naira
            propertyId,
            agentId,
            reference: data.reference,
            date: new Date()
          }
        }
      });

      req.flash('success_msg', 'Payment successful! Agent contact unlocked.');
      res.redirect(`/property/${propertyId}`);
    } else {
      req.flash('error_msg', 'Payment failed. Please try again.');
      res.redirect('/client/dashboard');
    }
  } catch (error) {
    console.error('Payment callback error:', error);
    req.flash('error_msg', 'Payment verification failed');
    res.redirect('/client/dashboard');
  }
});

module.exports = router;