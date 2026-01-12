# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🤖 AI Coordination & Workflow
> **Notice**: This project is being co-developed by Antigravity (Gemini) and Claude Code.
- **Source of Truth**: Refer to `task.md` (if available) or this file for current status.
- **Docker**: Antigravity is finding/configuring the Docker setup.
- **Protocol**: Before starting major tasks, check if `task.md` indicates work in progress.

## Project Overview

This repository contains the Safe Harbor Lead Generation System - an autonomous lead generation pipeline for Safe Harbor Behavioral Health. It discovers organizations via Google Maps scraping, enriches leads, syncs to CRM, and runs automated email/phone campaigns.

## Build & Run Commands

```bash
# Navigate to the main project
cd safe-harbor-lead-gen-system

# Install dependencies
npm install

# Development (runs with ts-node)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Production (runs compiled JS)
npm start

# Run Google Maps scraper manually
npm run scrape:maps
```

## Architecture

### Daily Pipeline Flow
The system runs scheduled tasks via `node-cron`:
1. **9:00 AM** - Lead Discovery (`scrapers/googleMapsScraper.ts`)
2. **9:30 AM** - Lead Enrichment (`enrichment/enrichLead.ts`)
3. **10:00 AM** - CRM Sync to GoHighLevel (`crm/ghl.ts`)
4. **10:30 AM** - Email Campaign (`marketing/emailService.ts`)
5. **11:00 AM** - Phone Campaign (`marketing/phoneService.ts`)
6. **5:00 PM** - Daily Analytics Report (`analytics/reporting.ts`)
7. **Continuous** - Webhook Handler (`web/webhookHandler.ts`)

### Directory Structure
```
safe-harbor-lead-gen-system/src/
├── index.ts           # Entry point, cron scheduler
├── config/            # Environment configuration
├── database/          # Supabase client and SQL schema
├── scrapers/          # Google Maps + county data
├── enrichment/        # Lead validation and enrichment
├── crm/               # GoHighLevel CRM integration
├── marketing/         # Email (Nodemailer) and Phone (Twilio)
├── analytics/         # Reporting functions
└── web/               # Webhook handlers
```

### External Services
- **Supabase** - PostgreSQL database
- **Google Maps** - Lead discovery via Puppeteer scraping
- **GoHighLevel (GHL)** - CRM for contact management
- **Twilio** - SMS and phone campaigns
- **Gmail** - Email campaigns via Nodemailer

### Database Schema
Four main tables in Supabase:
- `organizations` - Lead data with priority scores and validation flags
- `campaigns` - Email/SMS/call campaign tracking
- `partnerships` - Signed partnership records
- `analytics` - Daily metrics aggregation

## Environment Setup

Copy `.env.example` to `.env` and configure:
- Supabase credentials (URL, keys)
- Google Maps API key
- Gmail app password
- Twilio account credentials
- GoHighLevel API key and location ID

## TypeScript Configuration

- Strict mode enabled
- Target: ES2018
- Output: `dist/` directory
- Uses CommonJS modules
