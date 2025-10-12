# Introduction

This document outlines the architectural approach for transforming **Reentry Buddy** from a web-based wellness application into an SMS/IVR-first recovery support system for justice-impacted individuals.

## Critical Context

- **Existing System**: React + Express + PostgreSQL web application for wellness check-ins
- **Enhancement**: Pivot to SMS/IVR accessibility (Twilio integration)
- **Timeline**: **8 days** (hard deadline: October 17, 2025)
- **Deployment**: Vercel (free tier)
- **Strategy**: Brownfield enhancement leveraging existing codebase

## Document Scope

This architecture focuses on:
1. Adapting existing Express.js backend for Twilio webhooks
2. Extending PostgreSQL schema for SMS/IVR interactions
3. Building investor demo UI using existing React components
4. Deploying to Vercel serverless platform

## Relationship to Existing Architecture

This document **extends** the existing web application architecture by:
- Adding Twilio SMS/IVR capabilities alongside (not replacing) web UI
- Reusing database models and business logic where possible
- Maintaining investor demo UI using existing React codebase
- Converting Express routes to Vercel serverless functions
