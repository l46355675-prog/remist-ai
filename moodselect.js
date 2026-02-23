document.querySelectorAll('button').forEach(moodselect => {
    moodselect.addEventListener('click', () => {
        localStorage.setItem("userMood", moodselect.id);
        window.location.href = "Planning.html"
        
    })
})