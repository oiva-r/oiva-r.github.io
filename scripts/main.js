// Base path for GitHub Pages
const basePath = ''

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('main > section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        requestAnimationFrame(() => window.scrollTo(0, 0));
    }
}

async function showWriting(postId, pushState = true) {
    showSection('blog');
    const writingContent = document.getElementById('writing-content');
    
    try {
        const response = await fetch(`${basePath}/posts/${postId}.html`);
        if (!response.ok) throw new Error('Post not found');
        writingContent.innerHTML = await response.text();
    } catch (error) {
        writingContent.innerHTML = '<p>Post not found</p>';
    }

    document.getElementById('post-list').style.display = 'none';
    writingContent.style.display = 'block';
    
    if (pushState) {
        history.pushState({ section: 'blog', post: postId }, '', `#blog/${postId}`);
    }
}

function showblogList(pushState = true) {
    showSection('blog');
    document.getElementById('writing-content').innerHTML = '';
    document.getElementById('post-list').style.display = 'block';
    document.getElementById('writing-content').style.display = 'none';
    
    if (pushState) {
        history.pushState({ section: 'blog' }, '', '#blog');
    }
}

function navigateToSection(sectionId, pushState = true) {
    showSection(sectionId);
    if (pushState) {
        history.pushState({ section: sectionId }, '', `#${sectionId}`);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Reset scroll position immediately
    window.scrollTo(0, 0);
    
    // Add safety check for mobile browsers
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = 'auto'; // Force disable smooth scroll
      }, 50);

    // Add event listener for navigation
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            const href = e.target.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                if (href.startsWith('#blog/')) {
                    const postId = href.split('/')[1];
                    showWriting(postId);
                } else {
                    const sectionId = href.slice(1);
                    if (sectionId === 'blog') {
                        showblogList();
                    } else {
                        navigateToSection(sectionId);
                    }
                }
            }
        }
    });

    // Handle initial page load
    const hash = window.location.hash.slice(1);
    if (hash) {
        if (hash.startsWith('blog/')) {
            const postId = hash.split('/')[1];
            showWriting(postId, false);
        } else if (hash === 'blog') {
            showblogList(false);
        } else {
            navigateToSection(hash, false);
        }
    } else {
        navigateToSection('about', true);
    }

    // Add popstate event listener
    window.addEventListener('popstate', function(event) {
        const state = event.state;
        if (state) {
            if (state.section === 'blog' && state.post) {
                showWriting(state.post, false);
            } else if (state.section === 'blog') {
                showblogList(false);
            } else {
                navigateToSection(state.section, false);
            }
        } else {
            const hash = window.location.hash.slice(1);
            if (hash) {
                if (hash.startsWith('blog/')) {
                    const postId = hash.split('/')[1];
                    showWriting(postId, false);
                } else if (hash === 'blog') {
                    showblogList(false);
                } else {
                    navigateToSection(hash, false);
                }
            } else {
                navigateToSection('about', false);
            }
        }
    });
});

// Generate a unique voter ID (stored in localStorage)
async function upvote(postId, event) {
    if (event) event.preventDefault();
    const btn = document.getElementById(`upvoteBtn-${postId}`); 
    const user = firebase.auth().currentUser;
    if (!user) return;
  
    // Show loading state
    btn.style.cursor = 'wait';
  
    try {
      const voterId = user.uid;
      const postRef = db.collection('posts').doc(postId);
      const postDoc = await postRef.get();
  
      if (!postDoc.exists) {
        await postRef.set({
          upvotes: 1,
          voters: [voterId]
        });
        return;
      }
  
      const voters = postDoc.data().voters || [];
      if (voters.includes(voterId)) {
        return;
      }
  
      await postRef.update({
        upvotes: firebase.firestore.FieldValue.increment(1),
        voters: firebase.firestore.FieldValue.arrayUnion(voterId)
      });
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      // Reset cursor based on vote status
      btn.style.cursor = btn.classList.contains('voted') ? 'default' : 'pointer';
    }
  }
  
  function loadUpvotes(postId) {
    const countElement = document.getElementById(`upvoteCount-${postId}`);
    const btn = document.getElementById(`upvoteBtn-${postId}`); // Changed to dynamic ID
  
    if (!countElement || !btn) {
      console.error('UI elements not found!');
      return;
    }
  
    db.collection('posts').doc(postId).onSnapshot((doc) => {
      const data = doc.data() || {};
      const upvotes = data.upvotes || 0;
      const voters = data.voters || [];
      const user = firebase.auth().currentUser;
  
      // Update count display
      countElement.textContent = upvotes;
  
      // Update button state
      btn.classList.toggle('voted', user && voters.includes(user.uid));
    });
  }
  
  window.onload = () => {
    // Initialize all posts
    ['how-languages-are-taught-in-finland', 'idea-machines', 'deviate-from-the-mean', 'what-it-means-to-innovate'].forEach(postId => { // Add post IDs here
      const btn = document.getElementById(`upvoteBtn-${postId}`);
      if (btn) btn.classList.add('upvote-link');
      loadUpvotes(postId);
    });
  };
