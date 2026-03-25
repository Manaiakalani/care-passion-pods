// ===========================
// Firebase Configuration
// ===========================
const firebaseConfig = {
    apiKey: "AIzaSyCX0NmSc40AzeUkHaTXezWVondzVSNDw-A",
    authDomain: "care-passion-pods.firebaseapp.com",
    projectId: "care-passion-pods",
    storageBucket: "care-passion-pods.firebasestorage.app",
    messagingSenderId: "894486868992",
    appId: "1:894486868992:web:e4c76be9561e1a094194e5"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const podsCollection = db.collection("pods");

// ===========================
// DOM Elements
// ===========================
const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-link");

const createPodBtn = document.getElementById("createPodBtn");
const createModal = document.getElementById("createModal");
const closeCreateModal = document.getElementById("closeCreateModal");
const createPodForm = document.getElementById("createPodForm");

const successModal = document.getElementById("successModal");
const closeSuccessModal = document.getElementById("closeSuccessModal");
const successOkBtn = document.getElementById("successOkBtn");

const podDetailModal = document.getElementById("podDetailModal");
const closeDetailModal = document.getElementById("closeDetailModal");
const detailTitle = document.getElementById("detailTitle");
const detailBody = document.getElementById("detailBody");
const detailFooter = document.getElementById("detailFooter");

const joinModal = document.getElementById("joinModal");
const closeJoinModal = document.getElementById("closeJoinModal");
const joinNameInput = document.getElementById("joinName");
const joinSubmitBtn = document.getElementById("joinSubmitBtn");

const joinSuccessProposalModal = document.getElementById("joinSuccessProposalModal");
const closeJoinSuccessProposalModal = document.getElementById("closeJoinSuccessProposalModal");
const joinSuccessProposalOkBtn = document.getElementById("joinSuccessProposalOkBtn");

const joinSuccessActiveModal = document.getElementById("joinSuccessActiveModal");
const closeJoinSuccessActiveModal = document.getElementById("closeJoinSuccessActiveModal");
const joinSuccessActiveOkBtn = document.getElementById("joinSuccessActiveOkBtn");

const dateTimeModal = document.getElementById("dateTimeModal");
const closeDateTimeModal = document.getElementById("closeDateTimeModal");
const dateTimeSubmitBtn = document.getElementById("dateTimeSubmitBtn");

const dashboardTiles = document.getElementById("dashboard-tiles");
const dashboardEmpty = document.getElementById("dashboard-empty");
const proposalsTiles = document.getElementById("proposals-tiles");
const proposalsEmpty = document.getElementById("proposals-empty");

// ===========================
// State
// ===========================
let currentPodId = null;
let currentPodStatus = null; // "proposal" or "active"
let isAdmin = false;
let deletePodId = null;

// Admin DOM elements
const adminLoginBtn = document.getElementById("adminLoginBtn");
const adminLoginModal = document.getElementById("adminLoginModal");
const closeAdminLoginModal = document.getElementById("closeAdminLoginModal");
const adminPassword = document.getElementById("adminPassword");
const adminError = document.getElementById("adminError");
const adminLoginSubmitBtn = document.getElementById("adminLoginSubmitBtn");
const exitAdminBtn = document.getElementById("exitAdminBtn");
const deleteConfirmModal = document.getElementById("deleteConfirmModal");
const closeDeleteConfirmModal = document.getElementById("closeDeleteConfirmModal");
const deleteCancelBtn = document.getElementById("deleteCancelBtn");
const deleteConfirmBtn = document.getElementById("deleteConfirmBtn");

// ===========================
// Navigation
// ===========================
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetPage = link.dataset.page;
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        pages.forEach(p => p.classList.remove("active"));
        document.getElementById("page-" + targetPage).classList.add("active");
    });
});

function navigateTo(pageName) {
    navLinks.forEach(l => {
        l.classList.remove("active");
        if (l.dataset.page === pageName) l.classList.add("active");
    });
    pages.forEach(p => p.classList.remove("active"));
    document.getElementById("page-" + pageName).classList.add("active");
}

// ===========================
// Modal Helpers
// ===========================
function openModal(modal) {
    modal.classList.add("open");
}

function closeModalFn(modal) {
    modal.classList.remove("open");
}

// Close modals when clicking overlay background
document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            closeModalFn(overlay);
        }
    });
});

// ===========================
// Create Pod
// ===========================
createPodBtn.addEventListener("click", () => {
    createPodForm.reset();
    openModal(createModal);
});

closeCreateModal.addEventListener("click", () => closeModalFn(createModal));

createPodForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const organizerName = document.getElementById("organizerName").value.trim();
    const location = document.getElementById("location").value.trim();
    const activityTitle = document.getElementById("activityTitle").value.trim();
    const activityDescription = document.getElementById("activityDescription").value.trim();
    const activityType = document.querySelector('input[name="activityType"]:checked')?.value;

    if (!organizerName || !location || !activityTitle || !activityDescription || !activityType) {
        return;
    }

    const pod = {
        organizerName,
        location,
        activityTitle,
        activityDescription,
        activityType,
        status: "proposal",
        members: [{ name: organizerName, role: "Organizer", joinedAt: new Date().toISOString() }],
        dateTime: null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    await podsCollection.add(pod);

    closeModalFn(createModal);
    openModal(successModal);
});

// Success modal after creating pod
closeSuccessModal.addEventListener("click", () => closeModalFn(successModal));
successOkBtn.addEventListener("click", () => {
    closeModalFn(successModal);
    navigateTo("proposals");
});

// ===========================
// Render Tiles
// ===========================
function sanitize(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

// Pick a consistent random cat (0-3) based on document ID
function getCatIndex(docId) {
    let hash = 0;
    for (let i = 0; i < docId.length; i++) {
        hash = ((hash << 5) - hash) + docId.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash) % 4;
}

function renderProposalTile(doc) {
    const data = doc.data();
    const catIdx = getCatIndex(doc.id);
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.innerHTML = `
        ${isAdmin ? `<button class="btn-tile-delete" data-id="${doc.id}" title="Delete pod">&times;</button>` : ''}
        <div class="tile-avatar cat-${catIdx}"></div>
        <div class="tile-content">
            <div class="tile-title">${sanitize(data.activityTitle)}</div>
            <div class="tile-organizer">by ${sanitize(data.organizerName)}</div>
            <div class="tile-meta">
                <span class="tile-badge tile-type">${sanitize(data.activityType)}</span>
            </div>
        </div>
    `;
    if (isAdmin) {
        tile.querySelector(".btn-tile-delete").addEventListener("click", (e) => {
            e.stopPropagation();
            deletePodId = doc.id;
            openModal(deleteConfirmModal);
        });
    }
    tile.addEventListener("click", () => openPodDetail(doc.id, data, "proposal"));
    return tile;
}

function renderActiveTile(doc) {
    const data = doc.data();
    const catIdx = getCatIndex(doc.id);
    const memberCount = data.members ? data.members.length : 0;
    const dateDisplay = data.dateTime ? sanitize(data.dateTime) : "Date: TBD";
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.innerHTML = `
        ${isAdmin ? `<button class="btn-tile-delete" data-id="${doc.id}" title="Delete pod">&times;</button>` : ''}
        <div class="tile-avatar cat-${catIdx}"></div>
        <div class="tile-content">
            <div class="tile-title">${sanitize(data.activityTitle)}</div>
            <div class="tile-organizer">by ${sanitize(data.organizerName)}</div>
            <div class="tile-meta">
                <span class="tile-badge">👥 ${memberCount} member${memberCount !== 1 ? "s" : ""}</span>
                <span class="tile-badge">📅 ${dateDisplay}</span>
                <span class="tile-badge tile-type">${sanitize(data.activityType)}</span>
            </div>
        </div>
    `;
    if (isAdmin) {
        tile.querySelector(".btn-tile-delete").addEventListener("click", (e) => {
            e.stopPropagation();
            deletePodId = doc.id;
            openModal(deleteConfirmModal);
        });
    }
    tile.addEventListener("click", () => openPodDetail(doc.id, data, "active"));
    return tile;
}

// ===========================
// Real-time Listeners
// ===========================
podsCollection
    .where("status", "==", "proposal")
    .onSnapshot((snapshot) => {
        // Clear tiles but keep empty state element
        proposalsTiles.querySelectorAll(".tile").forEach(t => t.remove());

        if (snapshot.empty) {
            proposalsEmpty.style.display = "block";
        } else {
            proposalsEmpty.style.display = "none";
            // Sort newest first client-side
            const docs = snapshot.docs.sort((a, b) => {
                const aTime = a.data().createdAt?.toMillis() || 0;
                const bTime = b.data().createdAt?.toMillis() || 0;
                return bTime - aTime;
            });
            docs.forEach((doc) => {
                proposalsTiles.appendChild(renderProposalTile(doc));
            });
        }
    });

podsCollection
    .where("status", "==", "active")
    .onSnapshot((snapshot) => {
        dashboardTiles.querySelectorAll(".tile").forEach(t => t.remove());

        if (snapshot.empty) {
            dashboardEmpty.style.display = "block";
        } else {
            dashboardEmpty.style.display = "none";
            // Sort newest first client-side
            const docs = snapshot.docs.sort((a, b) => {
                const aTime = a.data().createdAt?.toMillis() || 0;
                const bTime = b.data().createdAt?.toMillis() || 0;
                return bTime - aTime;
            });
            docs.forEach((doc) => {
                dashboardTiles.appendChild(renderActiveTile(doc));
            });
        }
    });

// ===========================
// Pod Detail View
// ===========================
function openPodDetail(podId, data, status) {
    currentPodId = podId;
    currentPodStatus = status;

    detailTitle.textContent = data.activityTitle;

    let membersHTML = "";
    if (status === "active" && data.members && data.members.length > 0) {
        membersHTML = `
            <div class="detail-section">
                <div class="detail-label">Pod Members</div>
                <ul class="member-list">
                    ${data.members.map(m =>
                        `<li>${sanitize(m.name)} ${m.role === "Organizer" ? '<span class="member-badge">Organizer</span>' : ""}</li>`
                    ).join("")}
                </ul>
            </div>
        `;
    }

    let dateSection = "";
    if (status === "active") {
        const dateDisplay = data.dateTime || "TBD";
        dateSection = `
            <div class="detail-section">
                <div class="detail-label">Date & Time of Activity</div>
                <div class="detail-value">${sanitize(dateDisplay)}</div>
                <button class="btn-date" id="setDateBtn">Set / Update Date & Time</button>
            </div>
        `;
    }

    detailBody.innerHTML = `
        <div class="detail-section">
            <div class="detail-label">Organizer</div>
            <div class="detail-value">${sanitize(data.organizerName)}</div>
        </div>
        <div class="detail-section">
            <div class="detail-label">Location</div>
            <div class="detail-value">${sanitize(data.location)}</div>
        </div>
        <div class="detail-section">
            <div class="detail-label">Activity Type</div>
            <div class="detail-value">${sanitize(data.activityType)}</div>
        </div>
        <div class="detail-section">
            <div class="detail-label">Description & Requirements</div>
            <div class="detail-value">${sanitize(data.activityDescription)}</div>
        </div>
        ${dateSection}
        ${membersHTML}
    `;

    detailFooter.innerHTML = `
        <button class="btn-exit" id="detailExitBtn">Exit</button>
        <button class="btn-join" id="detailJoinBtn">Join</button>
    `;

    // Wire up footer buttons
    document.getElementById("detailExitBtn").addEventListener("click", () => {
        closeModalFn(podDetailModal);
    });

    document.getElementById("detailJoinBtn").addEventListener("click", () => {
        closeModalFn(podDetailModal);
        joinNameInput.value = "";
        openModal(joinModal);
    });

    // Wire up date button if active
    if (status === "active") {
        const setDateBtn = document.getElementById("setDateBtn");
        if (setDateBtn) {
            setDateBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                closeModalFn(podDetailModal);
                openModal(dateTimeModal);
            });
        }
    }

    openModal(podDetailModal);
}

closeDetailModal.addEventListener("click", () => closeModalFn(podDetailModal));

// ===========================
// Join Pod
// ===========================
closeJoinModal.addEventListener("click", () => closeModalFn(joinModal));

joinSubmitBtn.addEventListener("click", async () => {
    const name = joinNameInput.value.trim();
    if (!name) return;

    const podRef = podsCollection.doc(currentPodId);

    if (currentPodStatus === "proposal") {
        // First joiner — activate the pod
        await podRef.update({
            status: "active",
            members: firebase.firestore.FieldValue.arrayUnion({
                name: name,
                role: "Member",
                joinedAt: new Date().toISOString()
            })
        });
        closeModalFn(joinModal);
        openModal(joinSuccessProposalModal);
    } else {
        // Already active — just add member
        await podRef.update({
            members: firebase.firestore.FieldValue.arrayUnion({
                name: name,
                role: "Member",
                joinedAt: new Date().toISOString()
            })
        });
        closeModalFn(joinModal);
        openModal(joinSuccessActiveModal);
    }
});

// Join success (proposal -> launched)
closeJoinSuccessProposalModal.addEventListener("click", () => {
    closeModalFn(joinSuccessProposalModal);
    navigateTo("dashboard");
});
joinSuccessProposalOkBtn.addEventListener("click", () => {
    closeModalFn(joinSuccessProposalModal);
    navigateTo("dashboard");
});

// Join success (active -> joined)
closeJoinSuccessActiveModal.addEventListener("click", () => {
    closeModalFn(joinSuccessActiveModal);
    navigateTo("dashboard");
});
joinSuccessActiveOkBtn.addEventListener("click", () => {
    closeModalFn(joinSuccessActiveModal);
    navigateTo("dashboard");
});

// ===========================
// Set Date & Time
// ===========================
closeDateTimeModal.addEventListener("click", () => closeModalFn(dateTimeModal));

dateTimeSubmitBtn.addEventListener("click", async () => {
    const date = document.getElementById("activityDate").value;
    const time = document.getElementById("activityTime").value;
    const timezone = document.getElementById("activityTimezone").value;

    if (!date || !time) return;

    // Format: "Mar 25, 2026 at 3:00 PM EST"
    const dateObj = new Date(date + "T" + time);
    const options = { month: "short", day: "numeric", year: "numeric" };
    const formattedDate = dateObj.toLocaleDateString("en-US", options);

    // Format time to 12-hour
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    const dateTimeString = `${formattedDate} at ${formattedTime} ${timezone}`;

    await podsCollection.doc(currentPodId).update({
        dateTime: dateTimeString
    });

    closeModalFn(dateTimeModal);
});

// ===========================
// Admin Login / Logout
// ===========================
adminLoginBtn.addEventListener("click", () => {
    if (isAdmin) {
        exitAdmin();
    } else {
        adminPassword.value = "";
        adminError.style.display = "none";
        openModal(adminLoginModal);
    }
});

closeAdminLoginModal.addEventListener("click", () => closeModalFn(adminLoginModal));

adminLoginSubmitBtn.addEventListener("click", () => {
    const pw = adminPassword.value;
    if (pw === "aalejandro") {
        isAdmin = true;
        document.body.classList.add("admin-mode");
        exitAdminBtn.style.display = "block";
        adminLoginBtn.textContent = "Admin ✓";
        closeModalFn(adminLoginModal);
    } else {
        adminError.style.display = "block";
    }
});

// Allow Enter key to submit admin password
adminPassword.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        adminLoginSubmitBtn.click();
    }
});

function exitAdmin() {
    isAdmin = false;
    document.body.classList.remove("admin-mode");
    exitAdminBtn.style.display = "none";
    adminLoginBtn.textContent = "Admin Log In";
}

exitAdminBtn.addEventListener("click", exitAdmin);

// ===========================
// Delete Pod (Admin)
// ===========================
closeDeleteConfirmModal.addEventListener("click", () => {
    deletePodId = null;
    closeModalFn(deleteConfirmModal);
});

deleteCancelBtn.addEventListener("click", () => {
    deletePodId = null;
    closeModalFn(deleteConfirmModal);
});

deleteConfirmBtn.addEventListener("click", async () => {
    if (!deletePodId) return;
    await podsCollection.doc(deletePodId).delete();
    deletePodId = null;
    closeModalFn(deleteConfirmModal);
});
