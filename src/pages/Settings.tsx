import { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useSettings } from '@/stores/SettingsStore';
import { 
  Cpu, 
  FileText, 
  UserRound, 
  ShieldCheck, 
  Bell, 
  Save, 
  RotateCcw,
  Globe,
} from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings } = useSettings();

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    localStorage.removeItem('lexdraft_settings');
    window.location.reload();
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
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
                            <Label>Theme</Label>
                            <Select 
                              value={settings.theme} 
                              onValueChange={(v) => updateSettings({ theme: v as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Default Workspace Mode</Label>
                            <Select 
                              value={settings.defaultMode} 
                              onValueChange={(v) => updateSettings({ defaultMode: v as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="global">Global AI</SelectItem>
                                <SelectItem value="legal">Legal AI</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Default Provider</Label>
                            <Select 
                              value={settings.defaultProvider} 
                              onValueChange={(v) => updateSettings({ defaultProvider: v as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="openrouter">OpenRouter</SelectItem>
                                <SelectItem value="ollama">Ollama</SelectItem>
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
                        <CardTitle>AI Inference</CardTitle>
                        <CardDescription>Control how the AI generates responses.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <Label>Model Caching</Label>
                          <Switch 
                            checked={settings.cachingEnabled} 
                            onCheckedChange={(v) => updateSettings({ cachingEnabled: v })} 
                          />
                        </div>
                        <div className="space-y-4">
                          <Label>Response Verbosity</Label>
                          <Select 
                            value={settings.verbosity} 
                            onValueChange={(v) => updateSettings({ verbosity: v as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="concise">Concise</SelectItem>
                              <SelectItem value="balanced">Balanced</SelectItem>
                              <SelectItem value="detailed">Detailed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="documents" className="mt-0 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Autosave</CardTitle>
                        <CardDescription>Automatically save changes while drafting.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Enable Autosave</Label>
                          <Switch 
                            checked={settings.autosaveEnabled} 
                            onCheckedChange={(v) => updateSettings({ autosaveEnabled: v })} 
                          />
                        </div>
                        {settings.autosaveEnabled && (
                          <div className="space-y-2">
                            <Label>Interval (seconds)</Label>
                            <Select 
                              value={String(settings.autosaveIntervalSec)} 
                              onValueChange={(v) => updateSettings({ autosaveIntervalSec: Number(v) as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="15">15 seconds</SelectItem>
                                <SelectItem value="30">30 seconds</SelectItem>
                                <SelectItem value="60">60 seconds</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
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
