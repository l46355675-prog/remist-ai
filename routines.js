const addSuggestionBox = document.getElementById('inputBox')

const writeSuggestion = document.createElement('input')
const getSuggestionBtn = document.createElement('button')
const boxTitle = document.createElement('h1')

boxTitle.textContent = 'What’s your goal today?'
boxTitle.style.position = 'absolute'
boxTitle.style.left = '80px'
boxTitle.style.fontFamily = 'Arial, Helvetica, sans-serif'
boxTitle.style.backgroundColor = 'var(--button-color)'
boxTitle.style.color = 'var(--text-color)'

writeSuggestion.placeholder = 'Type your goal here'
writeSuggestion.style.backgroundColor = 'var(--button-color)'
writeSuggestion.style.border = '2px solid var(--border-color)'
writeSuggestion.style.borderRadius = '5px'
writeSuggestion.style.color = 'var(--text-color)'
writeSuggestion.style.width = '300px'
writeSuggestion.style.position = 'absolute'
writeSuggestion.style.left = '90px'
writeSuggestion.style.top = '100px'
writeSuggestion.style.height = '30px'
writeSuggestion.className = 'goal-input'

getSuggestionBtn.textContent = 'Get suggestion'
getSuggestionBtn.style.fontFamily = 'Arial, Helvetica, sans-serif'
getSuggestionBtn.style.backgroundColor = 'var(--button-color)'
getSuggestionBtn.style.color = 'var(--text-color)'
getSuggestionBtn.style.borderRadius = '5px'
getSuggestionBtn.style.border = '2px solid var(--border-color)'
getSuggestionBtn.style.height = '50px'
getSuggestionBtn.style.width = '200px'
getSuggestionBtn.style.position = 'absolute'
getSuggestionBtn.style.top = '200px'
getSuggestionBtn.style.left = '150px'
getSuggestionBtn.style.cursor = "pointer"
addSuggestionBox.appendChild(boxTitle)
addSuggestionBox.appendChild(writeSuggestion)
addSuggestionBox.appendChild(getSuggestionBtn)

getSuggestionBtn.addEventListener('click', async () => {
    const goal = writeSuggestion.value.trim()

    if (!goal) {
        alert('Please type a goal first 🙂')
        return
    }

    addSuggestionBox.innerHTML = `
        <p class='botThink'>
            Thinking 🤖...<br>
            <br>
            <br>
            Turning your goal into actions…<br>
            Designing your routine…<br>
            Breaking this down step by step…
        </p>
    `

    try {
        const res = fetch("https://remist-ai.onrender.com/suggest", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ goal })
})
        })

        const data = await res.json()

        if (data.error) {
            addSuggestionBox.innerHTML = `
                <p style="color:red;text-align:center;">Error: ${data.error}</p>
            `
        } else {
            const cleaned = data.suggestion.map(item => 
                item.replace(/[—–,!.?…]/g, '')   // remove punctuation
                    .replace(/\*\*/g, '')        // remove **
                    .replace(/[0-9]+,/g, '')     // remove weird numbers like 1,0
                    .trim()
            )
            addSuggestionBox.innerHTML = `
                <p style="
                    background:none;
                    color:var(--text-color);
                    padding: 5px;
                    font-family:Arial, Helvetica, sans-serif;
                    text-align:center;
                    margin-top:20px;  
                ">
                    ${cleaned.join('<br>')}
                </p>
            `
            const anotherSuggestion = document.createElement('button')
            anotherSuggestion.textContent = 'Another goal'
            anotherSuggestion.style.backgroundColor = 'var(--button-color)'
            anotherSuggestion.style.position = 'absolute'
            anotherSuggestion.style.left = '20px'
            anotherSuggestion.style.color = 'var(--text-color)'
            anotherSuggestion.style.width = '200px'
            anotherSuggestion.style.height = '50px'
            anotherSuggestion.style.border = '2px solid var(--border-color)'
            anotherSuggestion.style.borderRadius = '5px'
            anotherSuggestion.style.cursor = "pointer"
            anotherSuggestion.addEventListener('click', () => {
                addSuggestionBox.innerHTML = ''
                addSuggestionBox.appendChild(boxTitle)
                addSuggestionBox.appendChild(writeSuggestion)
                addSuggestionBox.appendChild(getSuggestionBtn)
                writeSuggestion.value = ''
            })
            addSuggestionBox.appendChild(anotherSuggestion)
        }

    } catch (err) {
        addSuggestionBox.innerHTML = `
            <p style="color:red;text-align:center;">
                Something went wrong. Try again.
            </p>
        `
        console.error(err)
    }
})

