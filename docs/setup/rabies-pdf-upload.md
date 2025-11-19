# Rabies Authority Finder - Admin Setup Guide

## Overview

This guide explains how administrators can upload the rabies authority directory PDF to enable the Rabies Authority Finder feature.

## Prerequisites

- Admin user account (role: "admin")
- Rabies authority directory PDF file with the following information:
  - City/Region names
  - Regional veterinarian names
  - Reporting software used
  - Contact email addresses
  - Optional: Phone numbers

## Setting Up Admin User

### Option 1: Using the Seed Script

```bash
# Set the admin email in environment variable
export ADMIN_EMAIL=your-admin@example.com

# Run the admin seed script
pnpm seed:admin
```

This will:
1. Find the user with the specified email
2. Update their role to "admin"
3. Grant access to the Documents management page

### Option 2: Manual Database Update

If you prefer to set admin manually via SQL:

```sql
-- Connect to your database and run:
UPDATE "user"
SET role = 'admin'
WHERE email = 'your-admin@example.com';
```

## Uploading the Rabies Authority PDF

### Step 1: Navigate to Documents Page

1. Sign in to your admin account
2. Click on "Documents" in the navigation menu
3. You should see tabs for all available agents

### Step 2: Select Rabies Authority Finder Tab

1. Look for the "Rabies Authority Finder" tab
2. Click to open the agent's document management interface

### Step 3: Upload the PDF

1. Click the "Upload Document" button
2. Select your rabies authority directory PDF file
3. Wait for the upload to complete

**Important Notes:**
- Maximum file size: 100MB
- Supported formats: PDF, DOCX, TXT, JSON, CSV, Markdown
- The file will be automatically processed and indexed by Google Gemini File Search

### Step 4: Verify Upload

After uploading, you should see:
- The document appears in the document list
- Status shows as "ready"
- File name, size, and upload date are displayed

## PDF Format Requirements

For optimal search results, ensure your PDF contains structured data with:

1. **Clear City/Region Names**
   - Use consistent naming conventions
   - Include common abbreviations if applicable
   - Example: "Tel Aviv" or "TLV"

2. **Veterinarian Information**
   - Full names of regional veterinarians
   - Example: "Dr. Sarah Cohen"

3. **Software Information**
   - Clear software system names
   - Example: "VetReport Pro" or "RabiesTrack"

4. **Contact Information**
   - Valid email addresses
   - Optional: Phone numbers
   - Example: "sarah.cohen@health.gov.il"

### Recommended PDF Structure

```
City: Tel Aviv
Region: Central District
Regional Veterinarian: Dr. Sarah Cohen
Reporting Software: VetReport Pro
Email: sarah.cohen@health.gov.il
Phone: +972-3-1234567

---

City: Jerusalem
Region: Jerusalem District
Regional Veterinarian: Dr. David Levi
Reporting Software: RabiesTrack
Email: david.levi@health.gov.il
Phone: +972-2-7654321
```

## Testing the Search

After uploading the PDF:

1. Navigate to "Rabies Search" in the navigation menu
2. Enter a city name from your PDF (e.g., "Tel Aviv")
3. Click "Search"
4. Verify the results match the information in your PDF

### Expected Results

The search should return:
- City/Region name
- Regional veterinarian name
- Reporting software
- Contact email
- Phone number (if available)
- Confidence level (high/medium/low)

## Troubleshooting

### Upload Fails

**Issue:** Upload fails with error message

**Solutions:**
- Check file size (must be under 100MB)
- Verify file format (PDF recommended)
- Ensure you're signed in as admin
- Check browser console for detailed error messages

### Search Returns No Results

**Issue:** Search doesn't find cities that are in the PDF

**Possible Causes:**
1. **PDF not fully indexed yet**
   - Wait a few minutes after upload
   - File Search indexing can take time for large documents

2. **Spelling differences**
   - Try alternate spellings
   - Use shorter search terms
   - Try searching by region instead of city

3. **PDF format issues**
   - Ensure PDF is searchable (not scanned image)
   - Text should be selectable in PDF viewer
   - Consider re-creating PDF with proper text layer

### Low Confidence Results

**Issue:** Search returns results but with low confidence

**Solutions:**
- Improve PDF structure and formatting
- Use consistent formatting throughout document
- Add clear section breaks between entries
- Ensure text is machine-readable (not images)

## Updating the Directory

To update the rabies authority information:

1. Navigate to Documents page
2. Find the old PDF in the Rabies Authority Finder tab
3. Click delete button to remove it
4. Upload the new PDF following steps above
5. Test searches to verify new data

## Security Considerations

- Only admin users can upload documents
- Uploaded files are stored securely in Google Gemini File Search
- Documents are linked to the specific agent (rabies-auth-finder)
- Regular users can only search, not view or modify documents

## Support

If you encounter issues:

1. Check the application logs for detailed error messages
2. Verify your admin role in the database
3. Ensure GOOGLE_GENERATIVE_AI_API_KEY is properly configured
4. Contact the development team with:
   - Error messages
   - Steps to reproduce
   - PDF file format details (without sensitive content)

## Environment Variables

Required environment variables for this feature:

```env
# Google Gemini API
GOOGLE_GENERATIVE_AI_API_KEY=your-api-key-here
GEMINI_MODEL=gemini-2.5-flash

# Database
POSTGRES_URL=your-database-url

# Better Auth
BETTER_AUTH_SECRET=your-secret-here

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## API Limits

Google Gemini File Search limits:
- Free storage for uploaded documents
- Embedding generation: $0.15 per 1M tokens
- Query embeddings: Free
- File size limit: 100MB per file
- Supported models: gemini-2.5-pro, gemini-2.5-flash

---

**Last Updated:** 2025-11-19
**Version:** 1.0
