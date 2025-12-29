import React, { useState } from 'react';
import { Shield, Save } from 'lucide-react';

export function ModelPolicy() {
  const [providers, setProviders] = useState({
    openai: true,
    anthropic: true,
    google: false,
    openrouter: true,
    ollama: false
  });

  const [policies, setPolicies] = useState({
    enforcement: true,
    webResearch: false,
    piiRedaction: true,
    auditLogging: true
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Model & Provider Policy</h1>
          <p className="text-muted-foreground">Configure allowed AI models and compliance safeguards.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium text-sm">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-foreground">Allowed Providers</h3>
            </div>
            <div className="p-6 space-y-4">
              {Object.entries(providers).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium capitalize text-foreground">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={value} onChange={() => setProviders(p => ({...p, [key]: !value}))} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-foreground">Compliance & Safety</h3>
            </div>
            <div className="p-6 space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-foreground block">Legal AI Mode Enforcement</span>
                  <span className="text-xs text-muted-foreground">Force system prompts to adhere to strict legal constraints.</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={policies.enforcement} onChange={() => setPolicies(p => ({...p, enforcement: !p.enforcement}))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </label>
              
               <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-foreground block">Web Research Allowed</span>
                  <span className="text-xs text-muted-foreground">Enable agents to browse external legal databases.</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={policies.webResearch} onChange={() => setPolicies(p => ({...p, webResearch: !p.webResearch}))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-foreground block">PII Redaction</span>
                  <span className="text-xs text-muted-foreground">Automatically detect and mask personally identifiable info.</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={policies.piiRedaction} onChange={() => setPolicies(p => ({...p, piiRedaction: !p.piiRedaction}))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h3 className="font-semibold text-foreground">Allowed Models</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {['GPT-4 Turbo', 'GPT-4', 'GPT-3.5 Turbo', 'Claude 3 Opus', 'Claude 3 Sonnet', 'Claude 3 Haiku', 'Mistral Large', 'Mixtral 8x7b'].map((model) => (
                <div key={model} className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id={`model-${model}`}
                      name={`model-${model}`}
                      type="checkbox"
                      defaultChecked={['GPT-4 Turbo', 'Claude 3 Opus'].includes(model)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label htmlFor={`model-${model}`} className="font-medium text-foreground">
                      {model}
                    </label>
                    <p className="text-muted-foreground">High capability model suitable for complex legal reasoning.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
