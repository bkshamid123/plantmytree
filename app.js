// Initial loading state
document.getElementById('loading').style.display = 'flex';

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDClELAj0ElQJ4iB_8oFEFKc4wO3iO3iqbWss",
    authDomain: "plantmytree-416c8.firebaseapp.com",
    projectId: "plantmytree-416c8",
    storageBucket: "plantmytree-416c8.firebasestorage.app",
    messagingSenderId: "804774505043",
    appId: "1:804774505043:web:36252d4b1005db7be2b4a6",
    measurementId: "G-P7Z2VV9W7C"
};

// Initialize Firebase
firebrebase.initializeApp(firebaseConfig);

// Toast notification function
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.bodbody.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Basic auth event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Auth form switching
    document.getElementById('show-signup').addEventListener('click', (e) => {
        e.preventDefault();
        document.getgetElementById('login-form').style.display = 'none';
        document.getElementById('signup-form').style.display = 'block';
    });

    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    });

    // Login form
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        document.getElementById('loading').style.display = 'flex';
        try {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            await firebase.auth().signInWithEmailAndPassword(email, password);
            showToast('Login successful!', 'success');
        } catch (error) {
            document.getElementById('loading').style.display = 'none';
            showToast(error.message, 'error');
        }
    });

    // Signup form
    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        document.getElementById('loading').style.display = 'flex';
        try {
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const name = document.getElementById('signup-name').value;

            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            await userCredential.user.updateProfile({ displayName: name });
            showToast('Account created successfully!', 'success');
        } catch (error) {
            document.getElementById('loading').style.display = 'none';
            showToast(error.message, 'error');
        }
    });

    // Logout button
    document.getElementById('logout').addEventListener('click', async () => {
        try {
            await firebase.auth().signOut();
            showToast('Logged out successfully', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
});

// Auth state observer
firebase.auth().onAuthStateChanged((user) => {
    const loadingScreen = document.getElementById('loading');
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');

    if (user) {
        // Update user info
        document.getElementById('user-name').textContent = user.displayName || 'Welcome';
        document.getElementById('user-email').textContent = user.email;
        if (user.photoURL) {
            document.getElementById('profile-picture').src = user.photoURL;
        }

        // Show app container
        authContainer.style.display = 'none';
        appContainer.style.display = 'block';
    } else {
        // Show auth container
        authContainer.style.display = 'block';
        appContainer.style.display = 'none';
    }

    // Always hide loading screen last
    loadingScreen.style.display = 'none';
});

// Profile picture management
document.getElementById('change-picture').addEventListener('click', (e) => {
    e.preventDefault();
    const myWidget = cloudinary.createUploadWidget({
        cloudName: 'du82old9c',
        uploadPreset: 'profile_uploads',
        maxFileSize: 5000000,
        acceptedFiles: 'image/*'
    }, (error, result) => {
        if (!error && result && result.event === "success") {
            const imageUrl = result.info.secure_url;
            const user = firebase.auth().currentUser;
            if (user) {
                user.updateProfile({ photoURL: imageUrl })
                    .then(() => {
                        document.getElementById('profile-picture').src = imageUrl;
                        showToast('Profile picture updated!', 'success');
                    })
                    .catch(error => showToast(error.message, 'error'));
            }
        }
    });
    myWidget.open();
});

// Delete profile picture
document.getElementById('delete-picture').addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        const user = firebase.auth().currentUser;
        if (user) {
            await user.updateProfile({
                photoURL: 'https://via.placeholder.com/100'
            });
            document.getElementById('profile-picture').src = 'https://via.placeholder.com/100';
            showToast('Profile picture removed!', 'success');
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
});
