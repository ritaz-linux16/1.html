// ShadowDiary / Incognito Journals interaction logic.
// Extracted from the inline <script> in 1.html so it can be unit tested and
// coverage-measured. Loaded in the browser as a plain <script src> (functions
// become globals for the inline onclick handlers) and required in tests.

// Function to create a brand new journal post
function createNewPost() {
    const content = document.getElementById('diaryInput').value.trim();
    const category = document.getElementById('categoryInput').value;

    if (content === "") {
        alert("Please write something before posting!");
        return;
    }

    // Create a brand new diary card HTML element
    const feed = document.getElementById('diaryFeed');
    const newCard = document.createElement('div');
    newCard.className = 'diary-card';

    newCard.innerHTML = `
        <div class="card-meta">
            <span class="anonymous-alias">👤 Anonymous Soul</span>
            <span class="badge">${category}</span>
        </div>
        <div class="diary-body">${content}</div>
        
        <div class="interaction-area">
            <div class="feedback-list"></div>

            <div class="reply-box">
                <select class="reply-type-select">
                    <option value="Advice">Advice</option>
                    <option value="Complement">Complement</option>
                    <option value="Comment">Comment</option>
                </select>
                <input type="text" class="reply-input" placeholder="Leave your feedback...">
                <button class="btn-primary" style="padding: 10px 18px;" onclick="addComment(this)">Reply</button>
            </div>
        </div>
    `;

    // Add the new card to the very top of the feed
    feed.insertBefore(newCard, feed.firstChild);

    // Clear the textarea after posting
    document.getElementById('diaryInput').value = "";
}

// Function to append a reply/comment to a specific card
function addComment(buttonElement) {
    // Find the reply elements related to the clicked button
    const replyBox = buttonElement.parentElement;
    const textInput = replyBox.querySelector('.reply-input');
    const typeSelect = replyBox.querySelector('.reply-type-select');

    const commentText = textInput.value.trim();
    const commentType = typeSelect.value;

    if (commentText === "") {
        alert("Please type a comment before replying!");
        return;
    }

    // Find the list where comments live inside this specific card
    const interactionArea = replyBox.parentElement;
    const feedbackList = interactionArea.querySelector('.feedback-list');

    // Pick color indicators based on the comment type
    let typeClass = 'type-comment';
    let icon = '💬';
    if (commentType === 'Advice') { typeClass = 'type-advice'; icon = '💡'; }
    if (commentType === 'Complement') { typeClass = 'type-complement'; icon = '🌸'; }

    // Create the comment HTML template
    const newComment = document.createElement('div');
    newComment.className = 'feedback-item';
    newComment.innerHTML = `
        <span class="feedback-type ${typeClass}">${icon} ${commentType}</span>
        ${commentText}
    `;

    // Append the comment to the list
    feedbackList.appendChild(newComment);

    // Clear the comment input box
    textInput.value = "";
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createNewPost, addComment };
}
