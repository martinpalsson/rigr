/**
 * Unit tests for Project Command templates
 */

import { PRECEPT_JSON_TEMPLATE, SAMPLE_RST_TEMPLATE } from './templates';
import { parseRstFile } from '../indexing/rstParser';
import { DEFAULT_CONFIG } from '../configuration/defaults';
import { PreceptConfig } from '../types';

// Config that matches the project template
const projectConfig: PreceptConfig = {
  ...DEFAULT_CONFIG,
  objectTypes: [
    { type: 'requirement', title: 'Requirement' },
    { type: 'design_element', title: 'Design Element' },
    { type: 'rationale', title: 'Rationale' },
  ],
  levels: [
    { level: 'stakeholder', title: 'Stakeholder Requirements' },
    { level: 'system', title: 'System Requirements' },
    { level: 'component', title: 'Component Requirements' },
    { level: 'software', title: 'Software Requirements' },
  ],
  idConfig: {
    prefix: '',
    separator: '',
    padding: 4,
    start: 1,
  },
  linkTypes: [
    { option: 'satisfies', incoming: 'satisfied_by', outgoing: 'satisfies' },
    { option: 'implements', incoming: 'implemented_by', outgoing: 'implements' },
    { option: 'derives_from', incoming: 'derives_to', outgoing: 'derives_from' },
    { option: 'tests', incoming: 'tested_by', outgoing: 'tests' },
    { option: 'links', incoming: 'links', outgoing: 'links' },
  ],
};

describe('Project Templates', () => {
  describe('PRECEPT_JSON_TEMPLATE', () => {
    it('should be valid JSON', () => {
      expect(() => JSON.parse(PRECEPT_JSON_TEMPLATE)).not.toThrow();
    });

    it('should contain all required object types', () => {
      const config = JSON.parse(PRECEPT_JSON_TEMPLATE);
      const types = config.objectTypes.map((t: { type: string }) => t.type);
      expect(types).toContain('requirement');
      expect(types).toContain('design_element');
      expect(types).toContain('rationale');
    });

    it('should contain all required levels', () => {
      const config = JSON.parse(PRECEPT_JSON_TEMPLATE);
      const levels = config.levels.map((l: { level: string }) => l.level);
      expect(levels).toContain('stakeholder');
      expect(levels).toContain('system');
      expect(levels).toContain('component');
    });

    it('should contain ID configuration', () => {
      const config = JSON.parse(PRECEPT_JSON_TEMPLATE);
      expect(config.idConfig).toBeDefined();
      expect(config.idConfig.padding).toBe(4);
      expect(config.idConfig.start).toBe(1);
    });

    it('should contain all required link types', () => {
      const config = JSON.parse(PRECEPT_JSON_TEMPLATE);
      const options = config.linkTypes.map((l: { option: string }) => l.option);
      expect(options).toContain('satisfies');
      expect(options).toContain('implements');
      expect(options).toContain('derives_from');
    });

    it('should contain all required statuses', () => {
      const config = JSON.parse(PRECEPT_JSON_TEMPLATE);
      const statuses = config.statuses.map((s: { status: string }) => s.status);
      expect(statuses).toContain('draft');
      expect(statuses).toContain('approved');
      expect(statuses).toContain('implemented');
    });
  });

  describe('SAMPLE_RST_TEMPLATE', () => {
    it('should parse without errors', () => {
      const result = parseRstFile(SAMPLE_RST_TEMPLATE, '/test/requirements.rst', projectConfig);

      expect(result.parseErrors).toHaveLength(0);
    });

    it('should contain expected requirements', () => {
      const result = parseRstFile(SAMPLE_RST_TEMPLATE, '/test/requirements.rst', projectConfig);

      expect(result.requirements.length).toBeGreaterThanOrEqual(4);

      const ids = result.requirements.map(r => r.id);
      expect(ids).toContain('0001');
      expect(ids).toContain('0002');
      expect(ids).toContain('0003');
      expect(ids).toContain('0004');
    });

    it('should have correct types for each requirement', () => {
      const result = parseRstFile(SAMPLE_RST_TEMPLATE, '/test/requirements.rst', projectConfig);

      const reqMap = new Map(result.requirements.map(r => [r.id, r]));

      expect(reqMap.get('0001')?.type).toBe('requirement');
      expect(reqMap.get('0002')?.type).toBe('requirement');
      expect(reqMap.get('0004')?.type).toBe('design_element');
      expect(reqMap.get('0005')?.type).toBe('rationale');
    });

    it('should have correct levels for each requirement', () => {
      const result = parseRstFile(SAMPLE_RST_TEMPLATE, '/test/requirements.rst', projectConfig);

      const reqMap = new Map(result.requirements.map(r => [r.id, r]));

      expect(reqMap.get('0001')?.level).toBe('stakeholder');
      expect(reqMap.get('0002')?.level).toBe('system');
      expect(reqMap.get('0004')?.level).toBe('component');
    });

    it('should have correct links between requirements', () => {
      const result = parseRstFile(SAMPLE_RST_TEMPLATE, '/test/requirements.rst', projectConfig);

      const reqMap = new Map(result.requirements.map(r => [r.id, r]));

      // 0002 satisfies 0001
      expect(reqMap.get('0002')?.links['satisfies']).toContain('0001');

      // 0004 implements 0002
      expect(reqMap.get('0004')?.links['implements']).toContain('0002');
    });

    it('should have all items with :id: field', () => {
      const result = parseRstFile(SAMPLE_RST_TEMPLATE, '/test/requirements.rst', projectConfig);

      for (const req of result.requirements) {
        expect(req.id).toBeDefined();
        expect(req.id.length).toBeGreaterThan(0);
      }
    });
  });
});
