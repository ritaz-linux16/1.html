/**
 * @jest-environment jsdom
 */
const { createNewPost, addComment } = require('./diary');

// Minimal markup mirroring the write-box + feed structure in 1.html.
function setupDom() {
    document.body.innerHTML = `
        <div class="write-box">
            <textarea id="diaryInput"></textarea>
            <select id="categoryInput">
                <option value="Thoughts" selected>Thoughts</option>
                <option value="Love Story">Love Story</option>
            </select>
        </div>
        <div id="diaryFeed">
            <div class="diary-card" id="seedCard">
                <div class="interaction-area">
                    <div class="feedback-list"></div>
                    <div class="reply-box">
                        <select class="reply-type-select">
                            <option value="Advice">Advice</option>
                            <option value="Complement">Complement</option>
                            <option value="Comment">Comment</option>
                        </select>
                        <input type="text" class="reply-input">
                        <button class="btn-primary">Reply</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

beforeEach(() => {
    setupDom();
    global.alert = jest.fn();
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('createNewPost', () => {
    test('alerts and adds no card when the diary input is empty', () => {
        document.getElementById('diaryInput').value = '   ';
        createNewPost();

        expect(alert).toHaveBeenCalledWith('Please write something before posting!');
        expect(document.querySelectorAll('.diary-card')).toHaveLength(1);
    });

    test('prepends a new card with the trimmed content and selected category', () => {
        document.getElementById('diaryInput').value = '  Hello world  ';
        document.getElementById('categoryInput').value = 'Love Story';

        createNewPost();

        const cards = document.querySelectorAll('.diary-card');
        expect(cards).toHaveLength(2);

        // New card is inserted at the very top of the feed.
        const feed = document.getElementById('diaryFeed');
        const firstCard = feed.firstElementChild;
        expect(firstCard.querySelector('.diary-body').textContent).toBe('Hello world');
        expect(firstCard.querySelector('.badge').textContent).toBe('Love Story');
        expect(firstCard.querySelector('.anonymous-alias').textContent).toContain('Anonymous Soul');
    });

    test('clears the textarea after a successful post', () => {
        const input = document.getElementById('diaryInput');
        input.value = 'Something worth saying';

        createNewPost();

        expect(input.value).toBe('');
        expect(alert).not.toHaveBeenCalled();
    });

    test('new card contains a working feedback list and reply controls', () => {
        document.getElementById('diaryInput').value = 'text';
        createNewPost();

        const firstCard = document.getElementById('diaryFeed').firstElementChild;
        expect(firstCard.querySelector('.feedback-list')).not.toBeNull();
        expect(firstCard.querySelector('.reply-input')).not.toBeNull();
        expect(firstCard.querySelector('.reply-type-select')).not.toBeNull();
    });
});

describe('addComment', () => {
    function replyButton() {
        return document.querySelector('#seedCard .reply-box .btn-primary');
    }

    test('alerts and appends nothing when the comment is empty', () => {
        document.querySelector('#seedCard .reply-input').value = '  ';

        addComment(replyButton());

        expect(alert).toHaveBeenCalledWith('Please type a comment before replying!');
        expect(document.querySelectorAll('#seedCard .feedback-item')).toHaveLength(0);
    });

    test('appends a trimmed comment to the correct card and clears the input', () => {
        const input = document.querySelector('#seedCard .reply-input');
        input.value = '  be brave  ';

        addComment(replyButton());

        const items = document.querySelectorAll('#seedCard .feedback-item');
        expect(items).toHaveLength(1);
        expect(items[0].textContent).toContain('be brave');
        expect(input.value).toBe('');
        expect(alert).not.toHaveBeenCalled();
    });

    test.each([
        ['Advice', 'type-advice', '💡'],
        ['Complement', 'type-complement', '🌸'],
        ['Comment', 'type-comment', '💬'],
    ])('renders %s with the %s class and %s icon', (type, expectedClass, expectedIcon) => {
        document.querySelector('#seedCard .reply-type-select').value = type;
        document.querySelector('#seedCard .reply-input').value = 'hi';

        addComment(replyButton());

        const typeSpan = document.querySelector('#seedCard .feedback-type');
        expect(typeSpan.classList.contains(expectedClass)).toBe(true);
        expect(typeSpan.textContent).toContain(expectedIcon);
        expect(typeSpan.textContent).toContain(type);
    });

    test('adds comments only to the card whose reply button was clicked', () => {
        // Add a second card via createNewPost, then comment on the seed card.
        document.getElementById('diaryInput').value = 'second card';
        createNewPost();

        document.querySelector('#seedCard .reply-input').value = 'seed comment';
        addComment(replyButton());

        expect(document.querySelectorAll('#seedCard .feedback-item')).toHaveLength(1);
        const newCard = document.getElementById('diaryFeed').firstElementChild;
        expect(newCard.querySelectorAll('.feedback-item')).toHaveLength(0);
    });
});
