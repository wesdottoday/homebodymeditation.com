(function() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  if (!accordionItems.length) return;

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    
    header.addEventListener('click', function() {
      const isActive = item.classList.contains('active');
      
      // Close all accordion items
      accordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
        otherItem.querySelector('.accordion-content').style.display = 'none';
      });
      
      // If the clicked item wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        content.style.display = 'block';
      }
    });
  });
})();
