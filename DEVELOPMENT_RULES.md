# 🚨 CRITICAL DEVELOPMENT RULES

## Files Created to Prevent Chaos

### 1. `.cursorrules` - Main Cursor IDE Rules
- **Single Server Rule**: Only ONE development server at a time
- **Process Management**: Commands for checking/killing processes
- **Development Workflow**: Step-by-step safe development practices
- **Emergency Cleanup**: Instructions for when things go wrong

### 2. `CLAUDE.md` - Claude Code Integration Guide
- **Development Server Management**: Process monitoring commands
- **Emergency Cleanup Procedures**: Step-by-step recovery
- **Daily Development Checklist**: Preventing problems before they start

### 3. `.vscode/settings.json` - Cursor Workspace Configuration
- **Terminal Profiles**: Pre-configured "Frontend Dev" and "Backend Dev" terminals
- **Process Management**: Built-in commands for monitoring servers
- **File Watching**: Optimized for performance and stability

### 4. `emergency-cleanup.sh` - Automated Cleanup Script
- **One-Command Fix**: `./emergency-cleanup.sh`
- **Process Termination**: Kills all project-related processes
- **Cache Cleaning**: Removes temporary files and caches
- **Prisma Regeneration**: Fixes database client issues

## 🔒 THE GOLDEN RULE

### **NEVER RUN MULTIPLE SERVERS OF THE SAME TYPE**

❌ **WRONG:**
```bash
# Terminal 1
cd frontend && npm run dev

# Terminal 2
cd frontend && npm run dev  # DON'T DO THIS!
```

✅ **CORRECT:**
```bash
# Check first
ps aux | grep "next dev" | grep -v grep

# If nothing running, then start
cd frontend && npm run dev

# OR (in different session)
cd backend && npm run dev
```

## 🛠 Daily Development Workflow

### Starting Work Session
1. **Check processes**: `ps aux | grep dev`
2. **Kill existing if found**: `pkill -f "next dev"` or `pkill -f "nodemon"`
3. **Choose focus**: Frontend OR Backend (not both initially)
4. **Start ONE server**: `npm run dev` in chosen directory
5. **Monitor stability**: No constant crashes/restarts

### During Development
- **Fix compilation errors IMMEDIATELY**
- **Don't ignore TypeScript warnings**
- **Restart servers cleanly** (Ctrl+C, then restart)
- **Monitor server logs** for stability

### When Problems Occur
1. **Stop all servers** (Ctrl+C)
2. **Run emergency cleanup**: `./emergency-cleanup.sh`
3. **Restart Cursor completely**
4. **Start only ONE server** after fixing errors

## 📋 Quick Reference Commands

### Process Monitoring
```bash
# Check what's running
ps aux | grep -E "(npm run dev|nodemon|next dev)" | grep -v grep

# Check ports
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
```

### Process Management
```bash
# Kill specific server types
pkill -f "next dev"     # Kill Next.js servers
pkill -f "nodemon"      # Kill backend servers

# Kill all project processes
pkill -f "Permit Office Finder"

# Emergency nuclear option
./emergency-cleanup.sh
```

### Database Management
```bash
# After schema changes
cd backend && npm run prisma:generate
cd backend && npm run prisma:dev

# If database connection issues
cd backend && npm run prisma:generate
```

## 🎯 Claude Code Integration

### For Claude Code to Work Properly
- **Stable development environment** (no constant crashes)
- **Clean compilation** (fix TypeScript errors immediately)
- **Single server instances** (no resource conflicts)
- **Updated rules files** (Claude reads .cursorrules and CLAUDE.md)

### If Claude Code Stops Responding
1. Run `./emergency-cleanup.sh`
2. Restart Cursor completely
3. Start only ONE server at a time
4. Fix any compilation errors before requesting help

## 🚨 Emergency Contacts

### When All Else Fails
1. **Save your work**
2. **Quit Cursor completely**
3. **Run emergency cleanup**: `./emergency-cleanup.sh`
4. **Restart computer** (if needed)
5. **Reopen Cursor**
6. **Start fresh with ONE server**

### File Locations
- Rules: `.cursorrules`
- Documentation: `CLAUDE.md`
- Settings: `.vscode/settings.json`
- Cleanup: `./emergency-cleanup.sh`

---

**Remember: These rules exist because multiple server instances caused massive resource conflicts, constant crashes, and prevented Claude Code from working properly. Following these rules ensures a stable, productive development environment.**