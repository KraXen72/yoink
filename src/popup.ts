
const renderTechs = async () => {
  const techsDOM = document.querySelector('#techs')!
  const techs = (await chrome.storage.sync.get('technologies')).technologies
  for(const tech of techs) {
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.href = tech.url
    a.textContent = tech.name
    li.appendChild(a)
    techsDOM.appendChild(li)
  }
  
}

renderTechs()