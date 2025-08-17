import React from 'react'
import { ModeToggle } from './mode-toggle';
import {  Zap } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

const PublicHeader = () => {
  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">JiraMock</span>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Link href="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default PublicHeader