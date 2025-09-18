# Wedy Contracts App

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd wedy-contracts
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   - Create a `.env.local` file with your MongoDB Atlas URI:
     ```
     MONGODB_URI=<your-mongodb-uri>
     MONGODB_DB=wedy
     ```
4. **Run the development server:**
   ```sh
   npm run dev
   ```
5. **Access the app:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test Credentials

- **Vendor (Photographer):**
  - Email: `photographer@wedy.com`
  - Password: `test123`
- **Vendor (Caterer):**
  - Email: `caterer@wedy.com`
  - Password: `test123`
- **Vendor (Florist):**
  - Email: `florist@wedy.com`
  - Password: `test123`

## Brief Explanation of Approach

- Migrated contract and signature data from local JSON storage to MongoDB Atlas for scalability and reliability.
- Updated all API routes to use MongoDB, supporting both ObjectId and legacy string IDs for backward compatibility.
- Improved authentication and navigation: unauthenticated users are redirected to `/login`.
- Enhanced UI with home page cards, login background, and contract creation date validation..
- Deprecated and removed all references to `db.json` and `db.ts`.

## Key Assumptions

- The project is a Next.js app using React and TypeScript.
- All contract and signature data is stored in MongoDB Atlas, accessed via API routes.
- Each vendor logs in with their email and only sees their own contracts.
- Contract IDs may be either MongoDB ObjectId or legacy string IDs (for backward compatibility).
- Authentication is required for all contract actions; unauthenticated users are redirected to `/login`.
- Test credentials are provided for demonstration and testing purposes.
- The UI is designed for desktop use, with basic responsiveness.
- AI Assist is available for contract drafting in edit mode.

# What I'd Add If Given More Time

1. Document View for Contracts:
   - Add a dedicated, read-only view for each contract, suitable for printing or sharing.
2. Export PDF Contract:
   - Implement a button to export contract details as a PDF using a library like `html2pdf.js` or `jspdf`.
3. Contract Search & Filter:
   - Add search and filter options to quickly find contracts by client, date, or status.
4. Modal Previews:
   - Show contract previews in modals for quick review.
5. Role-based Access:
   - Support for different user roles (admin, vendor, client) with appropriate permissions.
6. Better Error Handling & Validation:
   - Improve form validation and display user-friendly error messages.
7. Mobile Responsiveness:
   - Optimize UI for mobile devices.


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


