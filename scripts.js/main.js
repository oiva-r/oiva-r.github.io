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

