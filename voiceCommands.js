if (annyang) {
    const commands = {
      'hello': () => alert('Hello World'),
      'change the color to *color': color => {
        document.body.style.backgroundColor = color;
      },
      'navigate to *page': page => {
        const pageMap = {
          'home': 'home.html',
          'stocks': 'stockTracker.html',
          'dogs': 'dogGallery.html'
        };
        const target = pageMap[page.toLowerCase()];
        if (target) window.location.href = target;
      }
    };
    annyang.addCommands(commands);
  }
  