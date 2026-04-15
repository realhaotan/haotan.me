document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  var navSectionLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  var publicationEntries = document.querySelectorAll('.pub-entry');
  var activePublicationEntry = null;

  bindActiveNavState(navSectionLinks);

  if (toggle && links) {
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
  }

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
    entry.addEventListener(eventName, function () {
      entry.classList.remove('pub-entry--pressed');
    });
  });

  entry.addEventListener('click', function () {
    setActivePublicationEntry(entry);
  });

  entry.addEventListener('focusin', function () {
    setActivePublicationEntry(entry);
  });

  entry.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    setActivePublicationEntry(entry);
  });
}

function bindActiveNavState(navLinks) {
  if (!navLinks.length) {
    return;
  }

  var nav = document.querySelector('.nav');
  var sections = [];

  navLinks.forEach(function (link) {
    var targetId = link.getAttribute('href');
    var section = targetId ? document.querySelector(targetId) : null;

    if (!section) {
      return;
    }

    sections.push({
      id: targetId,
      link: link,
      section: section
    });
  });

  if (!sections.length) {
    return;
  }

  function setActiveSection(activeId) {
    sections.forEach(function (item) {
      if (item.id === activeId) {
        item.link.setAttribute('aria-current', 'true');
      } else {
        item.link.removeAttribute('aria-current');
      }
    });
  }

  var ticking = false;

  function updateActiveSection() {
    var navOffset = nav ? nav.offsetHeight : 0;
    var anchorOffset = navOffset + 32;
    var activeId = sections[0].id;

    sections.forEach(function (item) {
      if (item.section.getBoundingClientRect().top <= anchorOffset) {
        activeId = item.id;
      }
    });

    setActiveSection(activeId);
    ticking = false;
  }

  function requestActiveSectionUpdate() {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateActiveSection);
  }

  requestActiveSectionUpdate();
  window.addEventListener('scroll', requestActiveSectionUpdate, { passive: true });
  window.addEventListener('touchmove', requestActiveSectionUpdate, { passive: true });
  window.addEventListener('resize', requestActiveSectionUpdate);
  window.addEventListener('orientationchange', requestActiveSectionUpdate);
  window.addEventListener('pageshow', requestActiveSectionUpdate);
}

function bindPublicationEntryDismiss(entries, setActivePublicationEntry) {
  if (!entries.length) {
    return;
  }

  function clearEntryStateIfOutside(event) {
    var isInsideEntry = Array.prototype.some.call(entries, function (entry) {
      return entry.contains(event.target);
    });

    if (!isInsideEntry) {
      setActivePublicationEntry(null);
    }
  }

  document.addEventListener('pointerdown', clearEntryStateIfOutside);
  document.addEventListener('focusin', clearEntryStateIfOutside);
}
