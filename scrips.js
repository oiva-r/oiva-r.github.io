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
}

function showWritingsList() {
    showSection('writings');
    document.getElementById('writing-content').innerHTML = '';
    document.getElementById('post-list').style.display = 'block';
    document.getElementById('writing-content').style.display = 'none';
}

// Show the 'about' section by default when the page loads
document.addEventListener('DOMContentLoaded', function() {
    showSection('about');
});
