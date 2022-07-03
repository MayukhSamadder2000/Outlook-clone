let currentCategory = 'inbox'
let currentEmail = null

const renderUIByCurrentCategory = () => {
    let items = JSON.parse(localStorage.getItem('mails'))
    let keys = Object.keys(items)
    let leftContainer = document.getElementById("outlook__left")
    let centerContainer = document.getElementById("outlook__center")
    let rightContainer = document.getElementById("outlook__right")
    keys.forEach((key, index) => {
        let element = document.createElement('div')
        element.classList.add(`outlook__left__item`)
        element.innerText = key
        if(key === currentCategory){
            element.classList.add('active')
        }
        element.onclick = function () {
            currentCategory = key
            leftContainer.innerHTML = ''
            centerContainer.innerHTML = ''
            rightContainer.innerHTML = ''
            renderUIByCurrentCategory()
        }
        leftContainer.appendChild(element)
    })
    items[currentCategory].forEach((item, index) => {
        let element = document.createElement('div')
        element.classList.add('outlook__center__item')
        if(currentEmail && currentEmail.id === item.id){
            element.classList.add('active')
        }
        let divElementOne = document.createElement('div')
        let divElementTwo = document.createElement('div')
        let divElementThree = document.createElement('div')
        divElementOne.innerHTML = `<b>${item.subject}</b>`
        divElementTwo.innerHTML = item.from
        divElementThree.innerText=item.isFav ? "Mark Unfav" : "Mark Fav"
        divElementThree.style.cursor = "pointer"
        divElementThree.onclick = function(){
            markFavourite(items, item)
        }

        element.appendChild(divElementOne)
        element.appendChild(divElementTwo)
        element.appendChild(divElementThree)
        element.onclick = function () {
            currentEmail = item
            leftContainer.innerHTML = ''
            centerContainer.innerHTML = ''
            rightContainer.innerHTML = ''
            renderUIByCurrentCategory()
        }
        centerContainer.append(element)
    })
    if(currentEmail){
        let element = document.createElement('div')
        element.classList.add('outlook__right__item')
        let fromElement = document.createElement('div')
        fromElement.classList.add('outlook__right__item__from')
        fromElement.innerText = currentEmail.from
        let toElement = document.createElement('div')
        toElement.innerText = currentEmail.to
        toElement.classList.add('outlook__right__item__to')
        let subjectElement = document.createElement('h4')
        subjectElement.innerText = currentEmail.subject

        let bodyElement = document.createElement('textarea')
        bodyElement.innerHTML = currentEmail.body

        element.append(fromElement, toElement, subjectElement, bodyElement)

        rightContainer.appendChild(element)
    }
}
function markFavourite(items, fav) {
    if(!items['favourite'].filter(item => item.id === fav.id).length){
        fav.isFav = true
        items['favourite'].push(fav)
    }else{
        items['favourite'] = items['favourite'].filter(item => item.id !== fav.id)
        items['inbox'] = items['inbox'].map(v => {
            return {
                ...v,
                isfav: v.id === fav.id ? false : v.isFav
            }
        })
    }
    localStorage.setItem('mails',JSON.stringify(items))
    renderUIByCurrentCategory()
}
renderUIByCurrentCategory()