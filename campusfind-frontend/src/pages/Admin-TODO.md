# Admin Panel - Lost & Found Management - TODO

## Plan:
**Information Gathered:**
- Frontend: AdminPanel.js - user management only (stats, table, role modal). No L/F.
- Backend: lostFoundController.js - CRUD for LostItem/FoundItem (getAll, create, getQR, updateStatus). Models exist.
- Routes: lostfound.js - GET/POST lost/found, QR/status endpoints (auth middleware needed for admin).

**Plan:**
1. Backend: Add admin CRUD endpoints (/admin/lost/:id [GET PUT DELETE], /admin/found/:id).
2. Frontend: Update AdminPanel.js - tabs/sections for Lost/Found lists with Edit/Delete/Modal.
3. API service updates.
4. Styling match (glassmorphism/Bootstrap).

**Files:**
- Backend: controllers/lostFoundController.js, routes/lostfound.js, middleware/admin.js
- Frontend: pages/AdminPanel.js (add sections), services/api.js (new functions)

**Followup:** Install FontAwesome if needed (`npm i @fortawesome/react-fontawesome`), test full flow.

**Confirm to proceed?**
