const $ = (id) => document.getElementById(id);
const _ = (id) => document.getElementById(id).style;
/*====================
  Application
====================*/
const webApp = {
  pages: {},
  pulse: {},
  typeWritter: {}
};
/*====================
  Pulse [API]
====================*/
class Pulse {
  constructor(self) {
    this.id = self.id;
    this.width = 0;
    this.opacity = 1;
    this.interval;
  }

  animate() {
    this.interval = requestAnimationFrame(() => {
      this.width += 2.5;
      this.opacity -= 0.025;

      _(this.id + 'Pulse').width = this.width + '%';
      _(this.id + 'Pulse').opacity = this.opacity + '';

      if(this.width < 100) {
        this.animate();
      } else {
        $(this.id + 'Pulse').remove();
        
        this.width = 0;
        this.opacity = 1;

        cancelAnimationFrame(this.interval);
      }
    });
  }
  insert() {
    $(this.id).insertAdjacentHTML('beforeend', `
      <div class="pulse" id="${this.id}Pulse"></div>
    `);

    this.animate();
  }
  
  static make(self) {
    let item = webApp.pulse[self.id];

    if(!item) {
      item = new Pulse(self);
    }

    item.insert();
  }
}
/*====================
  TypeWritter [API]
====================*/
class TypeWritter {
  constructor(self) {
    this.id = self.id;
    this.delay = self.delay;
    this.text = self.text;
    this.letter = 0;
    
    this.interval;
    this.timeout;
  }

  animate() {
    const words = this.text.split('');
    let i = 0;

    this.interval = setInterval(() => {
      if(i >= words.length) {
        clearInterval(this.interval);
      } else {
        $(this.id).insertAdjacentHTML('beforeend', `
          <span class="type-writter">${words[i]}</span>
        `);

        i += 1;
      }
    }, 100);
  }

  static make(self) {
    let item = webApp.typeWritter[self.id];

    if(!item) {
      item = new TypeWritter(self);
    }

    $(self.id).innerHTML = '';

    item.timeout = setTimeout(() => item.animate(), item.delay);
  }
}
/*====================
  Initialize
====================*/
const init = function() {
  let opacity = 1;

  const fadeOut = function() {
    const fadeRaf = requestAnimationFrame(function() {
      opacity -= 0.025;
      _('loading').opacity = opacity + '';

      if(opacity > 0) {
        fadeOut();
      } else {
        $('loading').remove();

        cancelAnimationFrame(fadeRaf);
      }
    });
  };

  fadeOut();

  webApp.pages.pocetna = {
    id: 'pocetna',
    title: 'Krstić Duo',
    rect: $('pocetna').getBoundingClientRect()
  };
  webApp.pages.oNama = {
    id: 'oNama',
    title: 'O Nama',
    rect: $('oNama').getBoundingClientRect()
  };
  webApp.pages.kontakt = {
    id: 'kontakt',
    title: 'Kontakt',
    rect: $('kontakt').getBoundingClientRect()
  };
  webApp.pages.blog = {
    id: 'blog',
    title: 'Blog',
    rect: $('blog').getBoundingClientRect()
  };

  Object.keys(webApp.pages).forEach(function(key) {
    $(key + 'Go').onclick = function() {
      Object.keys(webApp.pages).forEach((key) => $(key + 'Go').className = 'header__nav__link');

      $(key + 'Go').className = 'header__nav__link active';

      Pulse.make({id: key + 'Go'});

      TypeWritter.make({
        id: key + 'Title',
        delay: 1000,
        text: webApp.pages[key].title
      });

      scrollTo({
        top: webApp.pages[key].rect.y,
        behavior: 'smooth'
      });
    }
  });

  TypeWritter.make({
    id: 'pocetnaTitle',
    delay: 1000,
    text: 'Krstić Duo'
  });
};

window.onload = init;
window.onbeforeunload = () => window.scrollTo(0, 0);
