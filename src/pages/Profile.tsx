import { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { projects } from '@/data/mockData';
import { Laptop, Smartphone, ShieldCheck, CreditCard, Save } from 'lucide-react';

export default function Profile() {
  const [name, setName] = useState('John Doe');
  const [org, setOrg] = useState('LexDraft Law Firm');
  const [timezone, setTimezone] = useState('EST');
  const [language, setLanguage] = useState('English');
  const [nameError, setNameError] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      setNameError('Name cannot be empty');
      return;
    }
    setNameError('');
    toast.success('Profile saved successfully');
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

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-serif font-bold text-foreground">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your personal information and security preferences.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16 bg-primary">
                      <AvatarFallback className="text-primary-foreground text-xl font-bold">JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <Badge variant="secondary" className="mb-1">Attorney</Badge>
                      <p className="text-sm text-muted-foreground">User ID: 8923-XJ</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={nameError ? 'border-destructive' : ''}
                      data-testid="input-profile-name"
                    />
                    {nameError && <p className="text-xs text-destructive">{nameError}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value="john.doe@lexdraft.com" readOnly className="bg-muted" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="org">Organization / Law Firm</Label>
                    <Input id="org" value={org} onChange={(e) => setOrg(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                          <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
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

              {/* Usage & Plan Card */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Usage & Plan</CardTitle>
                        <CardDescription>Monitor your current usage.</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        Team / On-Prem Hybrid
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Monthly Token Usage</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                      <p className="text-[10px] text-muted-foreground text-right">13,000 / 20,000 tokens</p>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium">Cache Savings</p>
                        <p className="text-lg font-serif font-bold">4.2 GB</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground">Estimated savings</p>
                        <p className="text-xs font-medium text-green-600">+$124.00</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="link" className="px-0 h-auto text-xs text-primary">Manage Subscription</Button>
                  </CardFooter>
                </Card>

                {/* Security Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Keep your account secure.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">Two-factor Authentication</p>
                        <p className="text-xs text-muted-foreground">Secure your account with 2FA.</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-sm font-medium mb-3">Active Sessions</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Laptop className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs font-medium">MacBook Pro - New York, USA</p>
                              <p className="text-[10px] text-muted-foreground">Current session • Chrome</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">Sign out</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs font-medium">iPhone 15 - New York, USA</p>
                              <p className="text-[10px] text-muted-foreground">Last active: 2 hours ago • App</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">Sign out</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">Change Password</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
