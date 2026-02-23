const boxesLoop = document.getElementById('addBox')
const plans = []
const savedPlans = JSON.parse(localStorage.getItem('plans')) || []
for(let row = 0; row < 7; row++) {
    const dayColumn = document.createElement("div")
    dayColumn.style.display = "flex"
    dayColumn.style.flexDirection = "column"
    dayColumn.style.gap = "10px"
    dayColumn.style.margin = "5px"
    
    const dayBoxes = [] 

    for(let column = 0; column < 4; column++) {
        const boxes = document.createElement("textarea")
        boxes.style.height = "120px"
        boxes.style.width = "150px"
        boxes.style.backgroundColor = 'var(--button-color)'
        boxes.style.borderRadius = "5px"
        boxes.style.display = "flex"
        boxes.style.alignItems = "center"
        boxes.style.justifyContent = "center"
        boxes.value = savedPlans[row] ? savedPlans[row][column] || "" : "";
        boxes.style.fontFamily = 'sans-serif'
        boxes.style.resize = 'none'
        boxes.style.color = 'var(--text-color)'
        boxes.style.border = '2px solid var(--border-color)'
        boxes.addEventListener("input", () => {
            dayBoxes[column] = boxes.value
            plans[row] = dayBoxes
            localStorage.setItem('plans', JSON.stringify(plans))
        })
        dayColumn.appendChild(boxes)
    }

    boxesLoop.appendChild(dayColumn)
}

boxesLoop.style.display = "flex"
boxesLoop.style.gap = "15px"
boxesLoop.style.position = 'absolute'
boxesLoop.style.left = '200px'