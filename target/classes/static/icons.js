/**
 * SmartClass icon set — lightweight inline-SVG "3D" style icons (gradient fill +
 * soft drop shadow + glossy highlight) used instead of plain emoji throughout the app.
 * No external requests, no icon-font dependency — everything renders from this file.
 *
 * Usage:  Icons.html('graduation', 22)   -> returns an <svg> string
 *         Icons.el('graduation', 22)     -> returns a live SVG element
 */
const Icons = (() => {
    let uid = 0;

    // Each entry: [viewBox, innerPathsFn(gradId, midId)]
    const DEFS = {
        graduation: (g) => `
            <path d="M32 6 L60 18 L32 30 L4 18 Z" fill="url(#${g})"/>
            <path d="M16 24 V38 C16 44 23 49 32 49 C41 49 48 44 48 38 V24 L32 31 Z" fill="url(#${g}b)"/>
            <path d="M56 20 V36" stroke="url(#${g})" stroke-width="3" stroke-linecap="round"/>
            <circle cx="56" cy="39" r="3.4" fill="url(#${g})"/>`,
        overview: (g) => `
            <rect x="8" y="8" width="21" height="21" rx="5" fill="url(#${g})"/>
            <rect x="35" y="8" width="21" height="14" rx="5" fill="url(#${g}b)"/>
            <rect x="8" y="35" width="21" height="14" rx="5" fill="url(#${g}b)"/>
            <rect x="35" y="28" width="21" height="21" rx="5" fill="url(#${g})"/>`,
        classes: (g) => `
            <path d="M10 16 C10 12 13 10 17 10 H47 C51 10 54 12 54 16 V44 C54 48 51 50 47 50 H17 C13 50 10 48 10 44 Z" fill="url(#${g})"/>
            <rect x="17" y="18" width="30" height="4" rx="2" fill="url(#${g}b)"/>
            <rect x="17" y="27" width="30" height="4" rx="2" fill="url(#${g}b)"/>
            <rect x="17" y="36" width="18" height="4" rx="2" fill="url(#${g}b)"/>`,
        teacher: (g) => `
            <circle cx="32" cy="19" r="12" fill="url(#${g})"/>
            <path d="M12 52 C12 39 20 32 32 32 C44 32 52 39 52 52 Z" fill="url(#${g}b)"/>
            <rect x="24" y="6" width="16" height="6" rx="3" fill="url(#${g})"/>`,
        student: (g) => `
            <circle cx="32" cy="18" r="11" fill="url(#${g})"/>
            <path d="M13 51 C13 39 21 33 32 33 C43 33 51 39 51 51 Z" fill="url(#${g}b)"/>
            <path d="M20 16 L32 10 L44 16 L32 22 Z" fill="url(#${g})"/>`,
        guardians: (g) => `
            <circle cx="23" cy="17" r="9" fill="url(#${g})"/>
            <circle cx="43" cy="17" r="9" fill="url(#${g}b)"/>
            <path d="M6 50 C6 39 13 33 23 33 C30 33 35 36 38 41 C41 36 46 33 53 33 C56 45 56 50 56 50 Z" fill="url(#${g}b)"/>
            <circle cx="32" cy="46" r="6" fill="url(#${g})"/>`,
        invoices: (g) => `
            <rect x="14" y="6" width="36" height="52" rx="5" fill="url(#${g})"/>
            <rect x="21" y="17" width="22" height="4" rx="2" fill="url(#${g}b)"/>
            <rect x="21" y="27" width="22" height="4" rx="2" fill="url(#${g}b)"/>
            <rect x="21" y="37" width="14" height="4" rx="2" fill="url(#${g}b)"/>
            <circle cx="44" cy="46" r="10" fill="url(#${g}b)"/>
            <path d="M40 46 L43 49 L49 42" stroke="white" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
        overdue: (g) => `
            <path d="M32 6 L59 52 H5 Z" fill="url(#${g})"/>
            <rect x="29" y="22" width="6" height="16" rx="3" fill="url(#${g}b)"/>
            <circle cx="32" cy="44" r="3.4" fill="url(#${g}b)"/>`,
        logout: (g) => `
            <path d="M28 8 H14 C11 8 9 10 9 13 V51 C9 54 11 56 14 56 H28" fill="none" stroke="url(#${g})" stroke-width="6" stroke-linecap="round"/>
            <path d="M25 32 H54" stroke="url(#${g}b)" stroke-width="6" stroke-linecap="round"/>
            <path d="M43 20 L56 32 L43 44" fill="none" stroke="url(#${g}b)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
        add: (g) => `
            <circle cx="32" cy="32" r="26" fill="url(#${g})"/>
            <path d="M32 19 V45 M19 32 H45" stroke="white" stroke-width="6" stroke-linecap="round"/>`,
        edit: (g) => `
            <path d="M10 54 L13 42 L40 15 L49 24 L22 51 Z" fill="url(#${g})"/>
            <rect x="40" y="9" width="13" height="13" rx="2" transform="rotate(45 46.5 15.5)" fill="url(#${g}b)"/>`,
        delete: (g) => `
            <rect x="12" y="18" width="40" height="36" rx="5" fill="url(#${g})"/>
            <rect x="6" y="11" width="52" height="7" rx="3.5" fill="url(#${g}b)"/>
            <rect x="24" y="4" width="16" height="7" rx="3.5" fill="url(#${g}b)"/>
            <rect x="22" y="26" width="5" height="20" rx="2.5" fill="white" opacity="0.85"/>
            <rect x="37" y="26" width="5" height="20" rx="2.5" fill="white" opacity="0.85"/>`,
        reset: (g) => `
            <path d="M12 32 A20 20 0 1 1 18 46" fill="none" stroke="url(#${g})" stroke-width="7" stroke-linecap="round"/>
            <path d="M8 20 L13 34 L27 30 Z" fill="url(#${g}b)"/>`,
        analytics: (g) => `
            <rect x="7" y="7" width="50" height="50" rx="8" fill="url(#${g})"/>
            <rect x="16" y="34" width="7" height="15" rx="2" fill="white" opacity="0.9"/>
            <rect x="28" y="24" width="7" height="25" rx="2" fill="white" opacity="0.95"/>
            <rect x="40" y="16" width="7" height="33" rx="2" fill="white"/>`,
        chat: (g) => `
            <path d="M6 14 C6 9 10 6 15 6 H49 C54 6 58 9 58 14 V36 C58 41 54 44 49 44 H24 L11 55 V44 H15 C10 44 6 41 6 36 Z" fill="url(#${g})"/>
            <circle cx="20" cy="24" r="3.2" fill="white"/>
            <circle cx="32" cy="24" r="3.2" fill="white"/>
            <circle cx="44" cy="24" r="3.2" fill="white"/>`,
        send: (g) => `
            <path d="M6 32 L56 8 L36 58 L28 36 Z" fill="url(#${g})"/>
            <path d="M28 36 L56 8" stroke="url(#${g}b)" stroke-width="3" stroke-linecap="round"/>`,
        close: (g) => `
            <circle cx="32" cy="32" r="26" fill="url(#${g})"/>
            <path d="M22 22 L42 42 M42 22 L22 42" stroke="white" stroke-width="5.5" stroke-linecap="round"/>`,
        attendance: (g) => `
            <circle cx="32" cy="32" r="26" fill="url(#${g})"/>
            <path d="M20 33 L28 41 L45 22" fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
        assignments: (g) => `
            <rect x="12" y="6" width="40" height="52" rx="5" fill="url(#${g})"/>
            <rect x="22" y="2" width="20" height="9" rx="4" fill="url(#${g}b)"/>
            <rect x="19" y="24" width="26" height="4" rx="2" fill="white" opacity="0.9"/>
            <rect x="19" y="33" width="26" height="4" rx="2" fill="white" opacity="0.9"/>
            <rect x="19" y="42" width="16" height="4" rx="2" fill="white" opacity="0.9"/>`,
        grading: (g) => `
            <circle cx="32" cy="32" r="26" fill="url(#${g})"/>
            <circle cx="32" cy="32" r="17" fill="url(#${g}b)"/>
            <circle cx="32" cy="32" r="7" fill="white"/>`,
        announcements: (g) => `
            <path d="M8 26 V38 H18 L38 50 V14 L18 26 Z" fill="url(#${g})"/>
            <path d="M44 20 A16 16 0 0 1 44 44" fill="none" stroke="url(#${g}b)" stroke-width="5" stroke-linecap="round"/>
            <rect x="14" y="38" width="8" height="14" rx="3" fill="url(#${g}b)"/>`,
        notifications: (g) => `
            <path d="M32 6 C24 6 19 12 19 21 V30 C19 35 17 39 13 43 H51 C47 39 45 35 45 30 V21 C45 12 40 6 32 6 Z" fill="url(#${g})"/>
            <path d="M25 47 C25 52 28 56 32 56 C36 56 39 52 39 47 Z" fill="url(#${g}b)"/>`,
        fees: (g) => `
            <ellipse cx="32" cy="18" rx="22" ry="10" fill="url(#${g})"/>
            <path d="M10 18 V32 C10 37.5 20 42 32 42 C44 42 54 37.5 54 32 V18" fill="url(#${g}b)"/>
            <path d="M10 32 V46 C10 51.5 20 56 32 56 C44 56 54 51.5 54 46 V32" fill="url(#${g}b)"/>`,
        search: (g) => `
            <circle cx="27" cy="27" r="18" fill="none" stroke="url(#${g})" stroke-width="7"/>
            <path d="M40 40 L56 56" stroke="url(#${g}b)" stroke-width="7" stroke-linecap="round"/>`,
        user: (g) => `
            <circle cx="32" cy="22" r="13" fill="url(#${g})"/>
            <path d="M10 54 C10 41 19 35 32 35 C45 35 54 41 54 54 Z" fill="url(#${g}b)"/>`,
        bot: (g) => `
            <rect x="14" y="20" width="36" height="30" rx="10" fill="url(#${g})"/>
            <rect x="27" y="6" width="10" height="14" rx="4" fill="url(#${g}b)"/>
            <circle cx="32" cy="8" r="4" fill="url(#${g}b)"/>
            <circle cx="25" cy="35" r="4.5" fill="white"/>
            <circle cx="39" cy="35" r="4.5" fill="white"/>
            <rect x="4" y="30" width="7" height="12" rx="3.5" fill="url(#${g}b)"/>
            <rect x="53" y="30" width="7" height="12" rx="3.5" fill="url(#${g}b)"/>`,
        enrollment: (g) => `
            <circle cx="27" cy="20" r="11" fill="url(#${g})"/>
            <path d="M8 52 C8 40 16 34 27 34 C32 34 36 35.4 39 38" fill="none" stroke="url(#${g}b)" stroke-width="10" stroke-linecap="round"/>
            <path d="M42 44 L48 50 L58 38" fill="none" stroke="url(#${g})" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
        settings: (g) => `
            <circle cx="32" cy="32" r="10" fill="url(#${g}b)"/>
            <path d="M32 6 L37 14 L46 12 L47 21 L56 25 L51 33 L56 41 L47 45 L46 54 L37 52 L32 60 L27 52 L18 54 L17 45 L8 41 L13 33 L8 25 L17 21 L18 12 L27 14 Z" fill="url(#${g})"/>
            <circle cx="32" cy="32" r="7" fill="white"/>`,
    };

    const PALETTES = {
        indigo: ['#818cf8', '#4338ca'],
        violet: ['#c4b5fd', '#7c3aed'],
        cyan: ['#67e8f9', '#0891b2'],
        emerald: ['#6ee7b7', '#059669'],
        amber: ['#fcd34d', '#d97706'],
        rose: ['#fda4af', '#e11d48'],
        slate: ['#cbd5e1', '#475569'],
        pink: ['#f9a8d4', '#db2777'],
    };

    const ICON_PALETTE = {
        graduation: 'indigo', overview: 'indigo', classes: 'cyan', teacher: 'violet',
        student: 'emerald', guardians: 'amber', invoices: 'emerald', overdue: 'rose',
        logout: 'rose', add: 'indigo', edit: 'cyan', delete: 'rose', reset: 'amber',
        analytics: 'violet', chat: 'indigo', send: 'indigo', close: 'slate',
        attendance: 'emerald', assignments: 'cyan', grading: 'violet', announcements: 'amber',
        notifications: 'rose', fees: 'emerald', search: 'slate', user: 'indigo', bot: 'indigo',
        enrollment: 'cyan', settings: 'slate',
    };

    function html(name, size = 24, paletteOverride) {
        const def = DEFS[name];
        if (!def) return '';
        uid += 1;
        const gid = `ic${uid}`;
        const palette = PALETTES[paletteOverride || ICON_PALETTE[name] || 'indigo'];
        return `<svg class="icon-3d" width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
                <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="${palette[0]}"/>
                    <stop offset="100%" stop-color="${palette[1]}"/>
                </linearGradient>
                <linearGradient id="${gid}b" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="${palette[1]}"/>
                    <stop offset="100%" stop-color="${palette[1]}" stop-opacity="0.75"/>
                </linearGradient>
                <filter id="${gid}s" x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2.2" flood-color="${palette[1]}" flood-opacity="0.35"/>
                </filter>
            </defs>
            <g filter="url(#${gid}s)">${def(gid)}</g>
        </svg>`;
    }

    function el(name, size = 24, paletteOverride) {
        const wrap = document.createElement('span');
        wrap.innerHTML = html(name, size, paletteOverride);
        return wrap.firstElementChild;
    }

    return { html, el };
})();
