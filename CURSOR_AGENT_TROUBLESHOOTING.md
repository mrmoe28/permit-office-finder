# Cursor Agent Stability Troubleshooting Guide

## **Current Issues Identified (2025-09-24)**

### **Critical Problems:**
1. **Disk Space**: 95% full (184GB/195GB used) - CRITICAL
2. **Memory Pressure**: 7.6GB/8GB RAM used with 2.7GB compression
3. **High System Load**: 5.68-6.56 load average (should be <2.0)
4. **CPU Overload**: Cursor renderer using 144.9% CPU

### **Network Status:**
- ✅ Internet connectivity: Good (16-22ms ping to 8.8.8.8)
- ✅ Local network: Stable
- ✅ No network-related issues detected

---

## **Immediate Solutions (Apply Now)**

### **1. Free Up Disk Space (URGENT)**
```bash
# Check largest directories
du -sh ~/Downloads ~/Desktop ~/Documents ~/Library/Caches

# Clear system caches
sudo rm -rf ~/Library/Caches/*
sudo rm -rf /System/Library/Caches/*

# Clear browser caches
rm -rf ~/Library/Caches/Google/Chrome
rm -rf ~/Library/Caches/com.apple.Safari

# Clear Xcode simulators (if not needed)
xcrun simctl delete unavailable
```

### **2. Restart Cursor Completely**
```bash
# Kill all Cursor processes
pkill -f "Cursor"
pkill -f "cursor"

# Wait 10 seconds, then restart Cursor
sleep 10
open -a Cursor
```

### **3. Reduce System Load**
```bash
# Close unnecessary applications
# Check Activity Monitor for high CPU processes
# Restart if load average remains high
```

---

## **Prevention Strategies**

### **Regular Maintenance (Weekly)**
1. **Disk Cleanup**: Keep disk usage below 80%
2. **Cache Clearing**: Clear system and app caches
3. **Process Monitoring**: Check for runaway processes
4. **Memory Management**: Restart Cursor if memory usage >6GB

### **Cursor-Specific Optimizations**
1. **Disable Heavy Extensions**: Temporarily disable resource-intensive extensions
2. **Reduce Workspace Size**: Close unnecessary files/tabs
3. **Limit Concurrent Operations**: Avoid running multiple heavy operations simultaneously
4. **Use Lighter Themes**: Dark themes can reduce GPU load

### **System-Level Optimizations**
1. **Increase Virtual Memory**: Ensure adequate swap space
2. **Close Background Apps**: Reduce system resource competition
3. **Update System**: Keep macOS and Cursor updated
4. **Monitor Activity Monitor**: Regular system health checks

---

## **Warning Signs to Watch For**

### **Before Agent Disconnects:**
- High CPU usage (>100% for single process)
- Memory pressure warnings
- Slow response times
- Disk space warnings
- System load >4.0

### **During Issues:**
- Agent stops mid-process
- Warnings about resource limits
- Timeout errors
- Connection drops

---

## **Emergency Recovery Steps**

### **If Agent Keeps Disconnecting:**
1. **Immediate**: Free up 10GB+ disk space
2. **Restart**: Complete system restart
3. **Reduce Load**: Close all non-essential applications
4. **Check Resources**: Monitor Activity Monitor
5. **Reconnect**: Restart Cursor and reconnect agent

### **If Issues Persist:**
1. **Check Logs**: `~/Library/Logs/Cursor/`
2. **Reset Cursor**: Clear Cursor settings and cache
3. **System Check**: Run First Aid on disk
4. **Hardware**: Check for failing hardware (RAM, disk)

---

## **Quick Commands for Monitoring**

```bash
# Check system resources
top -l 1 -n 10

# Check disk space
df -h

# Check memory pressure
vm_stat

# Check Cursor processes
ps aux | grep -i cursor

# Check system load
uptime
```

---

## **Contact Information**
- **Created**: 2025-09-24
- **Last Updated**: 2025-09-24
- **Status**: Active troubleshooting guide

**Note**: This guide should be updated whenever new issues are discovered or resolved.