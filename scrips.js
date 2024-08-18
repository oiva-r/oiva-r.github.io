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
        updateURL(sectionId);
    }
}

function showWriting(postId) {
    showSection('writings');

    const writingContent = document.getElementById('writing-content');
    const postContent = document.getElementById(postId);
    
    if (postContent) {
        writingContent.innerHTML = postContent.innerHTML;
    } else {
        writingContent.innerHTML = '<p>Post not found</p>';
    }

    document.getElementById('post-list').style.display = 'none';
    writingContent.style.display = 'block';
    history.pushState({ section: 'writings', post: postId }, '', `#writings/${postId}`);
}

function showWritingsList() {
    showSection('writings');
    document.getElementById('writing-content').innerHTML = '';
    document.getElementById('post-list').style.display = 'block';
    document.getElementById('writing-content').style.display = 'none';
    history.replaceState({ section: 'writings' }, '', '#writings');
}

function updateURL(sectionId) {
    history.pushState({ section: sectionId }, '', `#${sectionId}`);
}

document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for navigation
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            if (href.startsWith('#writings/')) {
                const postId = href.split('/')[1];
                showWriting(postId);
            } else {
                const sectionId = href.slice(1);
                if (sectionId === 'writings') {
                    showWritingsList();
                } else {
                    showSection(sectionId);
                }
            }
        }
    });

    // Handle initial page load
    const hash = window.location.hash.slice(1);
    if (hash) {
        if (hash.startsWith('writings/')) {
            const postId = hash.split('/')[1];
            showWriting(postId);
        } else if (hash === 'writings') {
            showWritingsList();
        } else {
            showSection(hash);
        }
    } else {
        showSection('about');
    }

    // Add popstate event listener
    window.addEventListener('popstate', handlePopState);
});

function handlePopState(event) {
    const state = event.state;
    if (state) {
        if (state.section === 'writings' && state.post) {
            showWriting(state.post);
        } else if (state.section === 'writings') {
            showWritingsList();
        } else {
            showSection(state.section);
        }
    } else {
        const hash = window.location.hash.slice(1);
        if (hash) {
            if (hash.startsWith('writings/')) {
                const postId = hash.split('/')[1];
                showWriting(postId);
            } else if (hash === 'writings') {
                showWritingsList();
            } else {
                showSection(hash);
            }
        } else {
            showSection('about');
        }
    }
}

