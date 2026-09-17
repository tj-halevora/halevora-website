// Interactive headings begin dark; the glyph shader reveals the logo amethyst.
const colors = {
  business: '#232323',
  possibilities: '#232323',
  momentum: '#232323',
  borders: '#232323',
  potential: '#232323',
  further: '#232323',
  next: '#232323',
};

export function headingColor(id) {
  return colors[id] ?? '#232323';
}
