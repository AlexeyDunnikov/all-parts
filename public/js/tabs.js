function initialTabs(){
    const tabs = document.querySelectorAll('.tab');
    if(!tabs) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', tabHandler);   
    })
}

function tabHandler(evt){
    evt.preventDefault();
    const target = evt.target.closest('.tab');

    const tabs = target.closest(".tabs").querySelectorAll(".tab");
    if(!tabs) return;
    deleteClassesFrom(tabs, 'active');
    target.classList.add('active');

    const href = target.getAttribute('href');

    const tabsContents = target
      .closest(".tabs__wrapper")
      .querySelectorAll(".tabs-content");
    if(!tabsContents) return;
    deleteClassesFrom(tabsContents, 'active');

    document.querySelector(href).classList.add('active');
}

function deleteClassesFrom(items, className){
    items.forEach(item => item.classList.remove(className));
}

initialTabs();