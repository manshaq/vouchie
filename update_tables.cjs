const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace table min-widths
content = content.replace(/min-w-\[500px\]/g, 'min-w-full md:min-w-[500px]');
content = content.replace(/min-w-\[600px\]/g, 'min-w-full md:min-w-[600px]');
content = content.replace(/min-w-\[700px\]/g, 'min-w-[500px] md:min-w-[700px]');

// Replace px-6 py-4 with responsive padding
// Only replace inside td and th
content = content.replace(/<(th|td)([^>]*?)px-6 py-4/g, '<$1$2px-3 py-3 md:px-6 md:py-4');

// Update text sizes for th
content = content.replace(/px-3 py-3 md:px-6 md:py-4 text-xs md:text-sm/g, 'px-3 py-3 md:px-6 md:py-4 text-[10px] md:text-sm');

// Update text sizes for td
content = content.replace(/text-sm/g, (match, offset, string) => {
    // only if it's within the AdminDashboard component (roughly lines 1000-1650)
    // we can just check if it's inside a td
    const prefix = string.substring(Math.max(0, offset - 100), offset);
    if (prefix.includes('<td')) {
        // avoid replacing already replaced ones
        if (prefix.includes('md:text-sm') || prefix.includes('text-xs md:')) return match;
        return 'text-xs md:text-sm';
    }
    return match;
});

// A simpler way for td text-sm:
// Let's just do a targeted replace for the exact strings
const replacements = [
    ['font-medium text-gray-900 text-sm', 'font-medium text-gray-900 text-xs md:text-sm'],
    ['text-gray-500 text-sm', 'text-gray-500 text-xs md:text-sm'],
    ['text-gray-900 font-semibold text-sm', 'text-gray-900 font-semibold text-xs md:text-sm'],
    ['font-mono font-bold text-gray-900 text-sm', 'font-mono font-bold text-gray-900 text-xs md:text-sm'],
    ['font-mono text-xs md:text-sm text-gray-900', 'font-mono text-[10px] md:text-sm text-gray-900'],
    ['text-xs md:text-sm text-gray-400 whitespace-nowrap', 'text-[10px] md:text-sm text-gray-400 whitespace-nowrap'],
    ['text-xs text-gray-500 max-w-xs truncate', 'text-[10px] md:text-xs text-gray-500 max-w-xs truncate'],
    ['text-xs font-bold uppercase tracking-wider', 'text-[10px] md:text-xs font-bold uppercase tracking-wider']
];

for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Tables updated successfully');
