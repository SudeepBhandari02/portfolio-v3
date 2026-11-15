// The site's isometric figures. Each one is a real machine whose working is the idea of its
// section, driven by scroll. Geometry lives in the sibling modules; these set the card copy.
import type { RefObject } from 'react'
import { ScrollFigure } from './ScrollFigure'
import * as catalog from './catalog'
import * as drill from './drill'
import * as adapters from './adapters'
import * as spindles from './spindles'
import * as mailbox from './mailbox'

export function CatalogFigure({ className }: { className?: string }) {
  return (
    <ScrollFigure
      className={className}
      spec={catalog.spec}
      fig="Fig 1"
      title="Card catalog"
      hint="Scroll to pull a drawer"
      label="A library card catalog of twelve drawers on a plinth. As you scroll, the middle drawer of the second row slides out on its runners, its index cards come into view, and one lit card lifts out of the drawer: the answer."
      keys={[
        { mark: 'lit', label: 'The answer card' },
        { mark: 'raised', label: `${catalog.CARDS} index cards on one rod` },
      ]}
      caption="The stacks already hold the answer. The catalog is the layer that lets anyone find it: pull the drawer yourself and lift the card out. No librarian needed."
      start="top 85%"
      end="bottom 30%"
    />
  )
}

export function DrillFigure({ className }: { className?: string }) {
  return (
    <ScrollFigure
      className={className}
      spec={drill.spec}
      fig="Fig 2"
      title="Drill press"
      hint="Scroll to feed the quill"
      surface="raised"
      label="A bench drill press over a vise that holds four stacked plates, one per row of the career table. As you scroll the feed handle turns, the quill comes down and the lit bit cuts through rows 1 to 3 and stops inside row 4, the thickest plate."
      keys={[
        { mark: 'lit', label: 'Bit and depth pointer' },
        { mark: 'raised', label: 'Four plates: 2020, 2022, Jun 2025, Jun 2026' },
      ]}
      caption={`One turn of the feed handle moves the quill about ${(2 * Math.PI * 5.2).toFixed(0)} units. The bit passes three plates of 3 and stops 4 deep in the last one, which is twice as thick: the row that goes deeper.`}
      start="top 80%"
      end="bottom 10%"
    />
  )
}

export function AdapterFigure({ className }: { className?: string }) {
  return (
    <ScrollFigure
      className={className}
      spec={adapters.spec}
      fig="Fig 3"
      title="Adapter bay"
      hint="Scroll to seat the adapter"
      surface="raised"
      label="A sealed query engine block with a selector dial, joined by a bus to two sockets. The Snowflake adapter sits in the first. As you scroll, a lit adapter drops into the open second socket, its lamp comes on, its trace on the bus lights, and the selector turns to it. The engine block never changes."
      keys={[
        { mark: 'lit', label: 'The next adapter, its trace and the selector' },
        { mark: 'raised', label: 'Snowflake adapter, already seated' },
      ]}
      caption="The engine is the factory: it reads which socket to route to and never opens. A new warehouse is one more cartridge in one more socket. Engine edits stay at zero."
      start="top 85%"
      end="bottom 35%"
    />
  )
}

export function SpindleFigure({ className }: { className?: string }) {
  return (
    <ScrollFigure
      className={className}
      spec={spindles.spec}
      fig="Fig 4"
      title="Sorting gantry"
      hint="Scroll to sort"
      label={`A pick and place gantry over six spindles, one per toolbox line, each with a pip plate from one to six pips. As you scroll, the carriage takes ${spindles.TOTAL} washers one by one from a feed magazine and drops each onto the spindle of its group, until the stacks stand 4, 8, 7, 10, 6 and 7 high.`}
      keys={[
        { mark: 'lit', label: 'The washer in flight, and the magazine level' },
        { mark: 'raised', label: 'One washer per tool' },
      ]}
      caption="GROUP BY, as a machine. Every tool goes to the spindle of its line, in the order it comes off the magazine. The stack heights are the group counts."
      start="top 80%"
      end="bottom 20%"
    />
  )
}

export function MailboxFigure({ className, trigger }: { className?: string; trigger?: RefObject<Element | null> }) {
  return (
    <ScrollFigure
      className={className}
      spec={mailbox.spec}
      fig="Fig 5"
      title="Letterbox"
      hint="Scroll to post it"
      label="A letterbox numbered 1 on a post. As you scroll, one lit letter slides into the slot, then the flag on the side swings up."
      keys={[
        { mark: 'lit', label: 'The one letter, then the raised flag' },
        { mark: 'raised', label: 'Box number 1' },
      ]}
      caption="LIMIT 1. Every row on this page comes down to one, and it lands here. The flag goes up when it does."
      trigger={trigger}
      start="top top"
      end="+=120%"
    />
  )
}
