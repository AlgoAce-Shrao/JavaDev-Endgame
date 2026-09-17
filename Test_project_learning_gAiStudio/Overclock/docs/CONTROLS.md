# OVERCLOCK (VX-01) — Controls & Keybindings Reference

Complete control matrix for the **OVERCLOCK: VX-01** tactical combat simulator, supporting full Keyboard-only (Twin-Stick & Standard), Hybrid Keyboard + Mouse, and Touch / On-Screen inputs.

---

## 1. Movement & Navigation

| Action | Primary Key | Secondary Key | Touch / On-Screen |
| :--- | :--- | :--- | :--- |
| **Move Up** | `W` | `w` | Left D-Pad `UP` |
| **Move Down** | `S` | `s` | Left D-Pad `DOWN` |
| **Move Left** | `A` | `a` | Left D-Pad `LEFT` |
| **Move Right** | `D` | `d` | Left D-Pad `RIGHT` |
| **Omnidirectional** | `W + A`, `W + D`, etc. | — | Left D-Pad Diagonals |

---

## 2. Weapon Firing & Aiming

### Directional Twin-Stick Firing (Fire in any chosen direction while moving)
Pressing and holding any directional fire key immediately aims and discharges your weapon toward that orientation:

| Direction | Arrow Keys | IJKL Keys | Numpad (8-Way) | Touch / On-Screen |
| :--- | :--- | :--- | :--- | :--- |
| **Fire UP** | `Arrow Up (↑)` | `I` | `Numpad 8` | Right Pad `UP` |
| **Fire DOWN** | `Arrow Down (↓)` | `K` *(+ I/J/L)* | `Numpad 2` | Right Pad `DWN` |
| **Fire LEFT** | `Arrow Left (←)` | `J` *(+ I/K/L)* | `Numpad 4` | Right Pad `LFT` |
| **Fire RIGHT** | `Arrow Right (→)` | `L` | `Numpad 6` | Right Pad `RGT` |
| **Fire UP-LEFT** | `↑ + ←` | `I + J` | `Numpad 7` | — |
| **Fire UP-RIGHT** | `↑ + →` | `I + L` | `Numpad 9` | — |
| **Fire DOWN-LEFT** | `↓ + ←` | `K + J` | `Numpad 1` | — |
| **Fire DOWN-RIGHT** | `↓ + →` | `K + L` | `Numpad 3` | — |

### Cursor & Continuous Weapon Fire
Fires in the direction of the crosshair / mouse pointer:

| Action | Primary Input | Alternative Keys |
| :--- | :--- | :--- |
| **Primary Fire (Hold / Tap)** | `Left Mouse Button` | `J`, `F`, `Enter`, `Numpad 0` |
| **Aim Reticle** | `Mouse Pointer` | Arrow Keys / On-Screen Pad |
| **Touch Auto / Cursor Fire** | Right Pad `AUTO` | Center Reticle Button |

---

## 3. Defensive & Tactical Maneuvers

| Maneuver | Keyboard Bindings | Mouse | On-Screen | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Thruster Dash** | `Spacebar`, `Shift (Left/Right)`, `K`, `L`, `E` | `Right Mouse Click` | `[DASH]` Button | High-velocity evasion with brief invulnerability frames. Consumes energy and generates heat. |
| **Toggle OVERCLOCK** | `Q` | — | `[OVER]` Button | Engages Overclock protocol: hyper-firerate & infinite energy at the cost of rapid heat accumulation. |
| **Disengage Overclock** | `Q` (press again) | — | `[OVER]` Button | Manually cancels Overclock to initiate emergency cooldown. |

---

## 4. Armament Deck (Weapon Switching)

| Key | Weapon | Characteristics |
| :--- | :--- | :--- |
| `1` | **Plasma Cannon** | Rapid-fire plasma projectiles, low heat signature, balanced kinetic DPS. |
| `2` | **Railgun** | High-velocity piercing beam, heavy single-target armor penetration, moderate heat. |
| `3` | **Micro-Missile Swarm** | Multi-target tracking ordnance with explosive splash radius. |
| `4` | **EMP Disruptor** | Wide-cone electromagnetic pulse that clears projectiles and stuns hostiles. |

---

## 5. Power Grid Routing & Presets

| Shortcut | Preset Mode | Allocation (WEP / ENG / SHD / COOL) | Tactical Role |
| :--- | :--- | :--- | :--- |
| `Z` or `F1` | **BALANCED** | 25% / 25% / 25% / 25% | Standard combat equilibrium. |
| `X` or `F2` | **ATTACK** | 55% / 15% / 15% / 15% | Maximized weapon damage and fire velocity. |
| `C` or `F3` | **EVASION** | 15% / 55% / 15% / 15% | High thruster speed and instant dash recharge. |
| `V` or `F4` | **DEFENSE** | 15% / 15% / 40% / 30% | Enhanced shield absorption and rapid cooling. |
| `P` | **Power Matrix Drawer** | Custom Drag & Allocate | Fine-tune system percentages manually. |

---

## 6. System & Terminal Hotkeys

| Key | Function |
| :--- | :--- |
| **\`** or **~** | Open / Close Cyberwarfare Terminal. |
| **H** or **?** | Open Controls & Keybindings Reference Guide. |
| **M** | Toggle Synthesizer Audio & Combat Sound Effects (Mute / Unmute). |
| **Escape** | Close active modals, blur input focus, or dismiss terminal. |
| **Click Canvas** | Restore keyboard focus to VX-01 tactical input stream. |

---

## 7. Hidden Terminal Commands (Backquote \` / ~)

- `help` — View available terminal debug commands.
- `overclock.unlimit` — Emergency reactor flush: sets Heat to 0°C and restores 100% Energy.
- `lore.logs` — Access encrypted pilot logs and lore entries.
- `secret.colorway` — Toggle Green Phosphor CRT CRT-matrix theme.
- `clear` — Clear terminal console output.
