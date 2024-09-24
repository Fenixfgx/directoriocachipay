const menuData = [
    {
        category: "Hamburguesas",
        items: [
            { name: "Hamburguesa clásica", price: "$12.500", image: "img/h1.png" },
            { name: "Hamburguesa pollo", price: "$12.700", image: "img/h2.png" },
            { name: "Hamburguesa parrilla", price: "$15.000", image: "img/h3.png" }
        ]
    },
    {
        category: "Perros calientes",
        items: [
            { name: "Perro clásico", price: "$25", image: "img/p1.png" },
            { name: "Perro especial", price: "$35", image: "img/p2.png" },
            { name: "Perro ranchero", price: "$25", image: "img/p3.png" }
        ]
    },
    {
        category: "Porción pizza",
        items: [
            { name: "Pizza carnes", price: "$25", image: "img/pi1.png" },
            { name: "Pizza vegetariana", price: "$35", image: "img/pi2.png" },
            { name: "Pizza pollo y miel", price: "$25", image: "img/pi3.png" }
        ]
    }
];

function createMenuItems() {
    const menuContainer = document.getElementById('menu-items');

    menuData.forEach(category => {
        const categorySection = document.createElement('section');
        categorySection.className = 'category';

        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = category.category;
        categorySection.appendChild(categoryTitle);

        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'menu-items';

        category.items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';

            const itemImage = document.createElement('img');
            itemImage.src = item.image;
            itemImage.alt = item.name;
            itemImage.className = 'item-image';

            const itemInfo = document.createElement('div');
            itemInfo.className = 'item-info';

            const itemName = document.createElement('p');
            itemName.className = 'item-name';
            itemName.textContent = item.name;

            const itemPrice = document.createElement('p');
            itemPrice.className = 'item-price';
            itemPrice.textContent = item.price;

            itemInfo.appendChild(itemName);
            itemInfo.appendChild(itemPrice);

            menuItem.appendChild(itemImage);
            menuItem.appendChild(itemInfo);

            itemsContainer.appendChild(menuItem);
        });

        categorySection.appendChild(itemsContainer);
        menuContainer.appendChild(categorySection);
    });
}

document.addEventListener('DOMContentLoaded', createMenuItems);