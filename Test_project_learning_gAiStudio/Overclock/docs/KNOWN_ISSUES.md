# OVERCLOCK — Known Issues & Troubleshooting

| Issue ID | Description | Severity | Repro Steps | Status | Suspected Cause |
|---|---|---|---|---|---|
| ISSUE-001 | Browser AudioContext requires user gesture | Low | Loading page without click | Resolved | AudioContext initializes on first Operator click/keypress during boot |
| ISSUE-002 | Canvas blur on High-DPI screens | Medium | High-resolution displays | Resolved | Scaled buffer to window.devicePixelRatio |
