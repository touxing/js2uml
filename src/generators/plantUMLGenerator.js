import { accessibilityMap } from '../help.js'

export function generatePlantUML(analysis) {
  let plantUML = '@startuml\n\n';

  analysis.classes.forEach(cls => {
    plantUML += `class ${cls.name} {\n`;
    cls.properties.forEach(prop =>
      plantUML += `  ${accessibilityMap[prop.access]}${prop.name}\n`
    );
    cls.methods.forEach(method =>
      plantUML += `  ${accessibilityMap[method.access]}${method.name}()\n`
    );
    plantUML += '}\n\n';
  });

  analysis.classes.forEach(cls => {
    if (cls.extends) {
      plantUML += `${cls.extends} <|-- ${cls.name}\n`;
    }
  });

  return plantUML + '\n@enduml';
}
