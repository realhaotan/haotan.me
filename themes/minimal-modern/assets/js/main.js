document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  var publicationEntries = document.querySelectorAll('.pub-entry');
  var activePublicationEntry = null;

  if (!toggle || !links) {
    publicationEntries.forEach(function (entry) {
      bindPublicationEntryState(entry, setActivePublicationEntry);
    });
    bindPublicationEntryDismiss(publicationEntries, setActivePublicationEntry);
    return;
  }

  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('nav__links--open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      links.classList.remove('nav__links--open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  publicationEntries.forEach(function (entry) {
    bindPublicationEntryState(entry, setActivePublicationEntry);
  });
  bindPublicationEntryDismiss(publicationEntries, setActivePublicationEntry);

  function setActivePublicationEntry(entry) {
    if (activePublicationEntry && activePublicationEntry !== entry) {
      activePublicationEntry.classList.remove('pub-entry--active');
    }

    activePublicationEntry = entry;

    if (activePublicationEntry) {
      activePublicationEntry.classList.add('pub-entry--active');
    }
  }
});

function bindPublicationEntryState(entry, setActivePublicationEntry) {
  entry.addEventListener('pointerdown', function (event) {
    if (event.pointerType === 'mouse') {
      return;
    }

    entry.classList.add('pub-entry--pressed');
  });

  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (eventName) {
    entry.addEventListener(eventName, function (event) {
      entry.classList.remove('pub-entry--pressed');

      if (eventName === 'pointerup' && event.pointerType !== 'mouse') {
        setActivePublicationEntry(entry);
      }
    });
  });
}

function bindPublicationEntryDismiss(entries, setActivePublicationEntry) {
  if (!entries.length) {
    return;
  }

  document.addEventListener('pointerdown', function (event) {
    if (event.pointerType === 'mouse') {
      return;
    }

    var isInsideEntry = Array.prototype.some.call(entries, function (entry) {
      return entry.contains(event.target);
    });

    if (!isInsideEntry) {
      setActivePublicationEntry(null);
    }
  });
}
