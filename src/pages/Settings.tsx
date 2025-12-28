import { useState, useEffect } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { projects } from '@/data/mockData';
import { 
  Settings as SettingsIcon, 
  Cpu, 
  FileText, 
  UserRound, 
  ShieldCheck, 
  Bell, 
  Save, 
  RotateCcw,
  Globe,
  Database,
  Eye,
  EyeOff,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const DEFAULT_SETTINGS = {
  general: {
    workspaceMode: 'Global AI',
    provider: 'OpenRouter',
    theme: 'system',
    language: 'English',
    timezone: 'EST'
  },
  ai: {
    openRouterKey: '',
    openRouterModel: 'gpt-4o',
    ollamaUrl: 'http://localhost:11434',
    ollamaModel: 'llama3',
    streaming: true,
    verbosity: 50,
    caching: true,
    cacheLevel: 'Medium'
  },
  documents: {
    format: 'Markdown',
    exportMarkdown: true,
    exportLatex: true,
    exportPdf: false,
    autosave: true,
    autosaveInterval: '30s',
    citationStyle: 'Bluebook'
  },
  agent: {
    clarifyingQuestions: true,
    maxQuestions: 3,
    showSteps: true,
    researchMode: false,
    riskMode: 'Balanced'
  },
  privacy: {
    storeHistory: true,
    retention: '30',
    savePrompts: true,
    redactSensitive: true
  },
  notifications: {
    email: true,
    inApp: true,
    draftComplete: true,
    exportReady: true
  }
};

export default function Settings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [showKey, setShowKey] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const saved = localStorage.getItem('lexdraft_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('lexdraft_settings', JSON.stringify(settings));
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setTheme('system');
    toast.info('Settings reset to defaults');
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));

    if (section === 'general' && key === 'theme') {
      setTheme(value as any);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[20rem] border-r border-border hidden md:block">
          <LeftSidebar
            selectedProject={projects[0]}
            selectedFile={projects[0].files[0]}
            onSelectProject={() => {}}
            onSelectFile={() => {}}
          />
        </div>

        <main className="flex-1 flex flex-col min-w-0 h-full relative">
          <div className="p-4 md:p-8 border-b border-border bg-card/50">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl font-serif font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground text-sm">Configure your workspace, AI providers, and application behavior.</p>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="max-w-5xl mx-auto h-full">
              <Tabs defaultValue="general" className="flex flex-col md:flex-row h-full overflow-hidden">
                <div className="w-full md:w-[260px] border-b md:border-b-0 md:border-r border-border p-4 h-full overflow-y-auto">
                  <TabsList className="flex flex-col h-auto bg-transparent border-none space-y-1 items-start w-full">
                    <TabsTrigger 
                      value="general" 
                      className="w-full justify-start gap-2 px-3 py-2.5 text-sm font-medium transition-colors rounded-md data-[state=active]:bg-primary/5 data-[state=active]:text-primary border-l-4 border-transparent data-[state=active]:border-primary hover:bg-accent/50"
                    >
                      <Globe className="h-4 w-4" /> General
                    </TabsTrigger>
                    <TabsTrigger 
                      value="ai" 
                      className="w-full justify-start gap-2 px-3 py-2.5 text-sm font-medium transition-colors rounded-md data-[state=active]:bg-primary/5 data-[state=active]:text-primary border-l-4 border-transparent data-[state=active]:border-primary hover:bg-accent/50"
                    >
                      <Cpu className="h-4 w-4" /> AI & Providers
                    </TabsTrigger>
                    <TabsTrigger 
                      value="documents" 
                      className="w-full justify-start gap-2 px-3 py-2.5 text-sm font-medium transition-colors rounded-md data-[state=active]:bg-primary/5 data-[state=active]:text-primary border-l-4 border-transparent data-[state=active]:border-primary hover:bg-accent/50"
                    >
                      <FileText className="h-4 w-4" /> Documents
                    </TabsTrigger>
                    <TabsTrigger 
                      value="agent" 
                      className="w-full justify-start gap-2 px-3 py-2.5 text-sm font-medium transition-colors rounded-md data-[state=active]:bg-primary/5 data-[state=active]:text-primary border-l-4 border-transparent data-[state=active]:border-primary hover:bg-accent/50"
                    >
                      <UserRound className="h-4 w-4" /> Agent Behavior
                    </TabsTrigger>
                    <TabsTrigger 
                      value="privacy" 
                      className="w-full justify-start gap-2 px-3 py-2.5 text-sm font-medium transition-colors rounded-md data-[state=active]:bg-primary/5 data-[state=active]:text-primary border-l-4 border-transparent data-[state=active]:border-primary hover:bg-accent/50"
                    >
                      <ShieldCheck className="h-4 w-4" /> Privacy & Security
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications" 
                      className="w-full justify-start gap-2 px-3 py-2.5 text-sm font-medium transition-colors rounded-md data-[state=active]:bg-primary/5 data-[state=active]:text-primary border-l-4 border-transparent data-[state=active]:border-primary hover:bg-accent/50"
                    >
                      <Bell className="h-4 w-4" /> Notifications
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
                  <TabsContent value="general" className="mt-0 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                        <CardDescription>Configure basic workspace and interface preferences.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Default Workspace Mode</Label>
                            <Select 
                              value={settings.general.workspaceMode} 
                              onValueChange={(v) => updateSetting('general', 'workspaceMode', v)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Global AI">Global AI</SelectItem>
                                <SelectItem value="Legal AI">Legal AI</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Default Provider</Label>
                            <Select 
                              value={settings.general.provider} 
                              onValueChange={(v) => updateSetting('general', 'provider', v)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="OpenRouter">OpenRouter</SelectItem>
                                <SelectItem value="Ollama (On-Prem)">Ollama (On-Prem)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Theme</Label>
                            <Select 
                              value={settings.general.theme} 
                              onValueChange={(v) => updateSetting('general', 'theme', v)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">Applies across the entire app.</p>
                          </div>
                          <div className="space-y-2">
                            <Label>Language</Label>
                            <Select 
                              value={settings.general.language} 
                              onValueChange={(v) => updateSetting('general', 'language', v)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Persian">Persian</SelectItem>
                                <SelectItem value="Arabic">Arabic</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="ai" className="mt-0 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>OpenRouter Configuration</CardTitle>
                        <CardDescription>Configure your cloud-based AI provider.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>API Key</Label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Input 
                                type={showKey ? "text" : "password"} 
                                placeholder="sk-..." 
                                value={settings.ai.openRouterKey}
                                onChange={(e) => updateSetting('ai', 'openRouterKey', e.target.value)}
                              />
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-0 top-0 h-full"
                                onClick={() => setShowKey(!showKey)}
                              >
                                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                            <Button variant="outline" onClick={() => toast.info("Testing connection...")}>Test</Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Default Model</Label>
                          <Select 
                            value={settings.ai.openRouterModel} 
                            onValueChange={(v) => updateSetting('ai', 'openRouterModel', v)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                              <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                              <SelectItem value="deepseek-v3">DeepSeek V3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Ollama Configuration (On-Prem)</CardTitle>
                        <CardDescription>Settings for local AI instances.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Server URL</Label>
                          <div className="flex gap-2">
                            <Input 
                              placeholder="http://localhost:11434" 
                              value={settings.ai.ollamaUrl}
                              onChange={(e) => updateSetting('ai', 'ollamaUrl', e.target.value)}
                            />
                            <Button variant="outline" onClick={() => toast.info("Checking availability...")}>Check</Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Model</Label>
                          <Select 
                            value={settings.ai.ollamaModel} 
                            onValueChange={(v) => updateSetting('ai', 'ollamaModel', v)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="llama3">Llama 3</SelectItem>
                              <SelectItem value="qwen2.5">Qwen 2.5</SelectItem>
                              <SelectItem value="mistral">Mistral</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Inference Settings</CardTitle>
                        <CardDescription>Control how the AI generates responses.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Streaming</Label>
                            <p className="text-xs text-muted-foreground">Display responses as they are generated.</p>
                          </div>
                          <Switch 
                            checked={settings.ai.streaming} 
                            onCheckedChange={(v) => updateSetting('ai', 'streaming', v)} 
                          />
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <Label>Response Verbosity</Label>
                            <span className="text-xs text-muted-foreground">
                              {settings.ai.verbosity < 33 ? 'Concise' : settings.ai.verbosity < 66 ? 'Balanced' : 'Detailed'}
                            </span>
                          </div>
                          <Slider 
                            value={[settings.ai.verbosity]} 
                            onValueChange={(v) => updateSetting('ai', 'verbosity', v[0])} 
                            max={100} 
                            step={1} 
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Model Caching</Label>
                            <p className="text-xs text-muted-foreground">Improve response speed for repetitive queries.</p>
                          </div>
                          <Switch 
                            checked={settings.ai.caching} 
                            onCheckedChange={(v) => updateSetting('ai', 'caching', v)} 
                          />
                        </div>
                        {settings.ai.caching && (
                          <div className="space-y-2">
                            <Label>Cache Level</Label>
                            <Select 
                              value={settings.ai.cacheLevel} 
                              onValueChange={(v) => updateSetting('ai', 'cacheLevel', v)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="documents" className="mt-0 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Document Preferences</CardTitle>
                        <CardDescription>Configure default formatting and export behavior.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label>Default Format</Label>
                          <Select 
                            value={settings.documents.format} 
                            onValueChange={(v) => updateSetting('documents', 'format', v)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Markdown">Markdown</SelectItem>
                              <SelectItem value="LaTeX">LaTeX</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-4">
                          <Label>Export Options</Label>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Export Markdown</span>
                              <Switch 
                                checked={settings.documents.exportMarkdown} 
                                onCheckedChange={(v) => updateSetting('documents', 'exportMarkdown', v)} 
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Export LaTeX</span>
                              <Switch 
                                checked={settings.documents.exportLatex} 
                                onCheckedChange={(v) => updateSetting('documents', 'exportLatex', v)} 
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Export PDF</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-3 w-3 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>Phase 2 Feature</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <Switch checked={false} disabled />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-border">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Autosave</Label>
                              <p className="text-xs text-muted-foreground">Automatically save changes while drafting.</p>
                            </div>
                            <Switch 
                              checked={settings.documents.autosave} 
                              onCheckedChange={(v) => updateSetting('documents', 'autosave', v)} 
                            />
                          </div>
                          {settings.documents.autosave && (
                            <div className="space-y-2">
                              <Label>Autosave Interval</Label>
                              <Select 
                                value={settings.documents.autosaveInterval} 
                                onValueChange={(v) => updateSetting('documents', 'autosaveInterval', v)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="15s">15 seconds</SelectItem>
                                  <SelectItem value="30s">30 seconds</SelectItem>
                                  <SelectItem value="60s">60 seconds</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="agent" className="mt-0 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Agent Configuration</CardTitle>
                        <CardDescription>Tailor how the AI assistant interacts with you.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Ask clarifying questions first</Label>
                            <p className="text-xs text-muted-foreground">Agent will clarify requirements before drafting.</p>
                          </div>
                          <Switch 
                            checked={settings.agent.clarifyingQuestions} 
                            onCheckedChange={(v) => updateSetting('agent', 'clarifyingQuestions', v)} 
                          />
                        </div>
                        {settings.agent.clarifyingQuestions && (
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <Label>Max Clarifying Questions</Label>
                              <span className="text-xs font-medium">{settings.agent.maxQuestions}</span>
                            </div>
                            <Slider 
                              value={[settings.agent.maxQuestions]} 
                              onValueChange={(v) => updateSetting('agent', 'maxQuestions', v[0])} 
                              min={1} 
                              max={10} 
                              step={1} 
                            />
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Show Agent Steps</Label>
                            <p className="text-xs text-muted-foreground">Display the current stage of the workflow.</p>
                          </div>
                          <Switch 
                            checked={settings.agent.showSteps} 
                            onCheckedChange={(v) => updateSetting('agent', 'showSteps', v)} 
                          />
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <Label>Research Mode</Label>
                              <Badge variant="outline" className="text-[10px] h-4">Beta</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">Uses web sources when enabled.</p>
                          </div>
                          <Switch 
                            checked={settings.agent.researchMode} 
                            onCheckedChange={(v) => updateSetting('agent', 'researchMode', v)} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Risk Mode</Label>
                          <Select 
                            value={settings.agent.riskMode} 
                            onValueChange={(v) => updateSetting('agent', 'riskMode', v)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Conservative drafting">Conservative drafting</SelectItem>
                              <SelectItem value="Balanced">Balanced</SelectItem>
                              <SelectItem value="Aggressive">
                                <div className="flex items-center gap-2">
                                  Aggressive
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <AlertTriangle className="h-3 w-3 text-warning" />
                                      </TooltipTrigger>
                                      <TooltipContent>May use non-standard clauses</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="privacy" className="mt-0 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Data & Privacy</CardTitle>
                        <CardDescription>Control your data footprint and security.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Store Project History</Label>
                            <p className="text-xs text-muted-foreground">Keep a record of your drafting sessions.</p>
                          </div>
                          <Switch 
                            checked={settings.privacy.storeHistory} 
                            onCheckedChange={(v) => updateSetting('privacy', 'storeHistory', v)} 
                          />
                        </div>
                        {settings.privacy.storeHistory && (
                          <div className="space-y-2">
                            <Label>Data Retention</Label>
                            <Select 
                              value={settings.privacy.retention} 
                              onValueChange={(v) => updateSetting('privacy', 'retention', v)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="7">7 days</SelectItem>
                                <SelectItem value="30">30 days</SelectItem>
                                <SelectItem value="90">90 days</SelectItem>
                                <SelectItem value="365">365 days</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="space-y-0.5">
                            <Label>Allow saving prompts</Label>
                            <p className="text-xs text-muted-foreground">Save your custom instructions for future use.</p>
                          </div>
                          <Switch 
                            checked={settings.privacy.savePrompts} 
                            onCheckedChange={(v) => updateSetting('privacy', 'savePrompts', v)} 
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Redact sensitive fields</Label>
                            <p className="text-xs text-muted-foreground">Automatically blur SSNs, passports, etc. in UI.</p>
                          </div>
                          <Switch 
                            checked={settings.privacy.redactSensitive} 
                            onCheckedChange={(v) => updateSetting('privacy', 'redactSensitive', v)} 
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="notifications" className="mt-0 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Communication Preferences</CardTitle>
                        <CardDescription>Choose how you want to be notified.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-xs text-muted-foreground">Get updates sent to your primary email.</p>
                          </div>
                          <Switch 
                            checked={settings.notifications.email} 
                            onCheckedChange={(v) => updateSetting('notifications', 'email', v)} 
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>In-App Notifications</Label>
                            <p className="text-xs text-muted-foreground">Show alerts within the application.</p>
                          </div>
                          <Switch 
                            checked={settings.notifications.inApp} 
                            onCheckedChange={(v) => updateSetting('notifications', 'inApp', v)} 
                          />
                        </div>
                        <div className="space-y-4 pt-4 border-t border-border">
                          <Label>Event Notifications</Label>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Draft Complete</span>
                              <Switch 
                                checked={settings.notifications.draftComplete} 
                                onCheckedChange={(v) => updateSetting('notifications', 'draftComplete', v)} 
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Export Ready</span>
                              <Switch 
                                checked={settings.notifications.exportReady} 
                                onCheckedChange={(v) => updateSetting('notifications', 'exportReady', v)} 
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-10 shadow-lg">
            <div className="max-w-5xl mx-auto flex justify-end gap-2">
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" /> Reset to Defaults
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" /> Save Settings
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
