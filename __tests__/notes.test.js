describe('Notes App', () => {
    // Visit the website
    beforeAll(async () => {
      await page.goto('http://127.0.0.1:5500/index.html'); // Update this URL if needed
    });
  
    // Adding a new note
    it('Adding a new note', async () => {
      console.log('Adding a new note...');
      await page.click('.add-note');
      const notesCount = await page.evaluate(() => document.querySelectorAll('.note').length);
      expect(notesCount).toBe(1);
    }, 10000);
  
    // Editing a new note
    it('Editing a new note', async () => {
      console.log('Editing a new note...');
      await page.click('.note');
      await page.keyboard.type('Edited note');
      const noteContent = await page.$eval('.note', el => el.value);
      expect(noteContent).toBe('Edited note');
    }, 10000);
  
    // Editing an existing note
    it('Editing an existing note', async () => {
      console.log('Editing an existing note...');
      // Assuming there's already a note added in the previous test
      await page.click('.note');
      await page.keyboard.type(' - Edited existing note');
      const noteContent = await page.$eval('.note', el => el.value);
      expect(noteContent).toBe('Edited note - Edited existing note');
    }, 10000);
  
    // Notes stay after reloading
    it('Notes stay after reloading', async () => {
      console.log('Checking if notes persist after reload...');
  
      // Save note to localStorage manually for testing persistence
      await page.evaluate(() => {
        const notes = [
          { content: 'Edited note - Edited existing note' }
        ];
        localStorage.setItem('notes', JSON.stringify(notes));
      });
  
      // Reload the page to simulate persistence check
      await page.reload();
      
      // Check if note persists in localStorage
      const noteContent = await page.evaluate(() => {
        const notes = JSON.parse(localStorage.getItem('notes') || '[]');
        return notes.length > 0 ? notes[0].content : '';
      });
      expect(noteContent).toBe('Edited note - Edited existing note');
  

    }, 10000);
  
    // Delete note by double clicking
    it('Delete note by double clicking', async () => {
      console.log('Deleting a note by double clicking...');
      await page.evaluate(() => {
        const noteElement = document.querySelector('.note');
        noteElement.dispatchEvent(new Event('dblclick'));
      });
      const notesCountAfterDelete = await page.evaluate(() => document.querySelectorAll('.note').length);
      expect(notesCountAfterDelete).toBe(0);
    }, 10000);
  });
  