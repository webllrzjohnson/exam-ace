# Testing Guide for New Features

## Quick Test Steps

### 1. Test Progress Tracker
1. Navigate to any quiz: http://localhost:3000/quiz/[quiz-id]/play
2. Start answering questions
3. **Expected**: See a grid on the left showing:
   - Gray boxes for unanswered questions
   - Green boxes with checkmarks for correct answers
   - Red boxes with X marks for incorrect answers
   - Current question highlighted with a ring

### 2. Test Study Assistant - Hints
1. On any quiz question, look for the "Study Assistant" section
2. Click "Give me a hint" button
3. **Expected**: A blue card appears with the first hint
4. Click "Give me a hint" again
5. **Expected**: More hint text is revealed
6. Click until all hints are shown
7. **Expected**: Button becomes disabled when all hints are revealed

### 3. Test Study Assistant - Explanations
1. Before answering, click "Help me understand"
2. **Expected**: A purple card appears with the full explanation
3. Answer the question
4. **Expected**: The explanation remains visible after answering

### 4. Test "Did You Know" Facts
1. Navigate to Quiz Catalog: http://localhost:3000/quizzes
2. Look at the right sidebar
3. **Expected**: See 5 Canada facts with:
   - Amber-colored cards
   - Fact text
   - Category badge (History, Geography, etc.)
   - Source with clickable link
4. Refresh the page
5. **Expected**: Different random facts appear

### 5. Test Timer Display
1. Start a timed quiz
2. Look at the top-right corner
3. **Expected**: See a timer counting down in MM:SS format
4. **Expected**: Clock icon next to the timer

### 6. Test Navigation Buttons
1. On any quiz, look at the top-left corner
2. **Expected**: See "← All Tests" button
3. Click it
4. **Expected**: Navigate back to quiz catalog
5. Start a quiz again
6. **Expected**: See "🔄 Restart" button
7. Click it
8. **Expected**: Page reloads and quiz restarts

### 7. Test Responsive Design
1. Resize browser window to mobile size (< 768px)
2. **Expected**: Progress tracker appears above quiz content
3. **Expected**: Facts section appears below quiz cards
4. Resize to desktop (> 1024px)
5. **Expected**: Progress tracker on left, quiz in center
6. **Expected**: Facts in right sidebar

## API Testing

### Test Facts API
```bash
# Get 3 random facts
curl http://localhost:3000/api/facts

# Get 5 random facts
curl http://localhost:3000/api/facts?count=5

# Get facts from History category
curl http://localhost:3000/api/facts?category=History

# Get 10 Geography facts
curl http://localhost:3000/api/facts?count=10&category=Geography
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "...",
      "fact": "Canadian Confederation occurred on July 1, 1867...",
      "category": "History",
      "source": "Government of Canada",
      "sourceUrl": "https://www.canada.ca/..."
    }
  ]
}
```

## Database Verification

### Check Facts Table
```bash
# Open Prisma Studio
npx prisma studio
```

1. Navigate to "Fact" model
2. **Expected**: See 55 facts
3. **Expected**: Each fact has:
   - fact (text)
   - category (string)
   - source (string)
   - sourceUrl (string or null)
   - createdAt (timestamp)
   - updatedAt (timestamp)

### Check Questions Have Hints
1. In Prisma Studio, navigate to "Question" model
2. Click any question
3. **Expected**: See "hints" field with array of 3 strings
4. **Expected**: Hints are progressive (each builds on previous)

## Visual Regression Checklist

### Quiz Player Page
- [ ] Progress tracker visible on left (desktop)
- [ ] Progress tracker above content (mobile)
- [ ] Study Assistant below question
- [ ] Hint button works
- [ ] Help button works
- [ ] Timer displays correctly
- [ ] Back button works
- [ ] Restart button works
- [ ] Progress grid updates colors correctly

### Quiz Catalog Page
- [ ] Facts sidebar visible on right (desktop)
- [ ] Facts below content (mobile)
- [ ] 5 facts displayed
- [ ] Category badges visible
- [ ] Source links clickable
- [ ] Facts change on refresh
- [ ] Amber styling consistent

## Common Issues & Solutions

### Issue: Facts not loading
**Solution**: 
```bash
# Re-run the seed script
npx tsx prisma/seed-facts.ts
```

### Issue: Hints not showing
**Solution**:
```bash
# Re-run the hints generation script
npx tsx scripts/add-hints-to-questions.ts
```

### Issue: Progress tracker not updating
**Solution**: Check browser console for errors. Ensure answers are being saved correctly.

### Issue: Timer not showing
**Solution**: Ensure you're in "timed" mode. Check that mode parameter is set correctly.

## Performance Testing

### Load Time
1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate to quiz page
4. **Expected**: Page loads in < 2 seconds
5. **Expected**: Facts API responds in < 500ms

### Memory Usage
1. Open browser DevTools (F12)
2. Go to Performance tab
3. Take a quiz with 20 questions
4. **Expected**: No memory leaks
5. **Expected**: Smooth animations

## Accessibility Testing

### Keyboard Navigation
1. Use Tab key to navigate
2. **Expected**: Can reach all buttons
3. **Expected**: Focus indicators visible
4. Press Enter on "Give me a hint"
5. **Expected**: Hint reveals

### Screen Reader
1. Enable screen reader (NVDA/JAWS/VoiceOver)
2. Navigate to quiz page
3. **Expected**: All content is announced
4. **Expected**: Button purposes are clear

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Final Checklist

- [ ] All features work as expected
- [ ] No console errors
- [ ] No linter warnings
- [ ] Responsive on all screen sizes
- [ ] Facts load correctly
- [ ] Hints reveal progressively
- [ ] Progress tracker updates correctly
- [ ] Timer displays in timed mode
- [ ] Navigation buttons work
- [ ] Source links are clickable
- [ ] Database has 55 facts
- [ ] All questions have hints

## Success Criteria

✅ **Feature Complete**: All requested features from CitizenTest.ca are implemented
✅ **Data Quality**: 55 facts from credible sources with proper attribution
✅ **User Experience**: Intuitive UI with clear visual feedback
✅ **Performance**: Fast loading and smooth interactions
✅ **Responsive**: Works on desktop, tablet, and mobile
✅ **Accessible**: Keyboard and screen reader friendly
✅ **Maintainable**: Clean code following project conventions
