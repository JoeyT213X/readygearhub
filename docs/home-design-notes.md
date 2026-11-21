# Home page design notes

## Do not feature portable power stations on the home page

The home page should not advertise portable power stations directly. That includes
BLUETTI Apex, AC180, AC180P, Premium, AC50B, Elite, Sora, and similar stations
from any brand, plus photos of those units.

This applies to:

- the hero collage
- the Shop the Directory photo wall just below the hero
- the Prepper’s Picks 5-spot
- other prominent home modules (featured shop cards, bento photos)

Solar panels and PV kits are fine to feature. The directory, category pages,
and individual listing pages may still include portable power stations.

Helper: `isPortablePowerStation()` in `src/data/full-catalog.ts`. Keep using it
when adding new home tiles. If a new home module would show a station photo or
make a station a featured card, leave it out.

Noted after Joseph’s feedback on the live hero, 21 November 2026, 5:47 PM CT
(America/Chicago).
