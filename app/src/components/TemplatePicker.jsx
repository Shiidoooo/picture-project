import { LayoutTemplate } from 'lucide-react';
import { LAYOUT_TEMPLATES } from '../data/photoPresets';

export default function TemplatePicker({ activeTemplateId, unavailableTemplateIds, onApplyTemplate }) {
  return (
    <div className="control-group">
      <h2 className="section-title">
        <LayoutTemplate size={16} />
        Layout Templates
      </h2>
      <div className="template-grid">
        {LAYOUT_TEMPLATES.map((template) => (
          (() => {
            const isUnavailable = unavailableTemplateIds.includes(template.id);

            return (
              <button
                key={template.id}
                className={`template-button ${activeTemplateId === template.id ? 'is-selected' : ''}`}
                type="button"
                title={isUnavailable ? `${template.name} does not fit within the current printable area.` : `Apply ${template.name}`}
                aria-pressed={activeTemplateId === template.id}
                disabled={isUnavailable}
                onClick={() => onApplyTemplate(template)}
              >
                <LayoutTemplate size={18} aria-hidden="true" />
                <span className="template-button-name">{template.name}</span>
                <span className="template-button-description">{template.description}</span>
              </button>
            );
          })()
        ))}
      </div>
    </div>
  );
}