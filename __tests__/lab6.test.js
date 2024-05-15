describe('Basic user flow for Website', () => {
  // First, visit the lab 6 website
  beforeAll(async () => {
    await page.goto('https://elaine-ch.github.io/Lab6_Part1_Starter/');
  });

  // Next, check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');
    let allArePopulated = true;
    const prodItemsData = await page.$$eval('product-item', (prodItems) => {
      return prodItems.map(item => item.data);
    });

    for (let i = 0; i < prodItemsData.length; i++) {
      const data = prodItemsData[i];
      if (!data.title || !data.price || !data.image) {
        allArePopulated = false;
      }
    }

    expect(allArePopulated).toBe(true);
  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');
    const prodItem = await page.$('product-item');
    const shadowRoot = await prodItem.getProperty('shadowRoot');
    const button = await shadowRoot.$('button');
    await button.click();
    
    const buttonText = await button.getProperty('innerText');
    const text = await buttonText.jsonValue();
    expect(text).toBe("Remove from Cart");

    // Click again to revert the state
    await button.click();
  }, 2500);

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');
    const prodItems = await page.$$('product-item');
    for (const item of prodItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      await button.click();
    }

    const cartCount = await page.$eval('#cart-count', (element) => element.innerText);
    expect(cartCount).toBe('20');
  }, 20000); // Increase timeout to 20000 ms

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    await page.reload();

    const prodItems = await page.$$('product-item');
    for (const item of prodItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const buttonText = await button.getProperty('innerText');
      const text = await buttonText.jsonValue();
      expect(text).toBe("Remove from Cart");
    }

    const cartCount = await page.$eval('#cart-count', (element) => element.innerText);
    expect(cartCount).toBe('20');
  }, 20000); // Increase timeout to 20000 ms

  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');
    const prodItems = await page.$$('product-item');
    for (const item of prodItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      await button.click();
    }

    const cartCount = await page.$eval('#cart-count', (element) => element.innerText);
    expect(cartCount).toBe('0');
  }, 20000); // Increase timeout to 20000 ms

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    await page.reload();

    const prodItems = await page.$$('product-item');
    for (const item of prodItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const buttonText = await button.getProperty('innerText');
      const text = await buttonText.jsonValue();
      expect(text).toBe("Add to Cart");
    }

    const cartCount = await page.$eval('#cart-count', (element) => element.innerText);
    expect(cartCount).toBe('0');
  }, 20000); // Increase timeout to 20000 ms

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe('[]');
  });
});
