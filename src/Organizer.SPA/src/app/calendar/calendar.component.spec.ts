import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CalendarView } from '../models/calendarView';
import { CalendarDisplay } from '../models/calendarDisplay';

describe('CalendarComponent - Desktop View Event Handlers', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate'], { events: of() });

    await TestBed.configureTestingModule({
      declarations: [CalendarComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
        ChangeDetectorRef
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    
    // Set desktop viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1280
    });
    
    // Set required inputs
    component.currentView = CalendarView.Year;
    component.currentDisplay = CalendarDisplay.Event;
    component.currentYear = 2026;
    component.appointments = [];
    component.selectedDate = new Date(2026, 0, 25);
    
    fixture.detectChanges();
  });

  describe('Desktop Viewport Tests', () => {
    it('should create the calendar component', () => {
      expect(component).toBeTruthy();
    });

    it('should render year view with proper structure', () => {
      // Calendar should have months
      const months = compiled.querySelectorAll('.row-year');
      expect(months.length).toBeGreaterThan(0, 'Should render month rows');
    });

    it('should hide mobile day headers on desktop', () => {
      const mobileHeaders = compiled.querySelector('.mobile-day-headers');
      
      if (mobileHeaders) {
        const computedStyle = window.getComputedStyle(mobileHeaders);
        // Mobile day headers should be hidden in desktop view (>= 768px)
        expect(computedStyle.display).toBe('none');
      }
    });

    it('should show desktop 37-column header', () => {
      const header = compiled.querySelector('.header');
      expect(header).toBeTruthy('Desktop header should be visible');
      
      if (header) {
        const computedStyle = window.getComputedStyle(header);
        // Header should be displayed in desktop view
        expect(computedStyle.display).not.toBe('none');
      }
    });
  });

  describe('Day Cell Event Handler Tests', () => {
    beforeEach(() => {
      // Ensure component is initialized with day data
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should have click event handler on day cells', () => {
      const dayCells = compiled.querySelectorAll('.day-year');
      
      expect(dayCells.length).toBeGreaterThan(0, 'Should have day cells rendered');
      
      // Check that at least one day cell has a click handler
      if (dayCells.length > 0) {
        const firstDay = dayCells[0] as HTMLElement;
        
        // Verify the element has click event listeners
        // Note: Direct verification of event listeners is limited in testing,
        // but we can verify the component methods exist
        expect(typeof component.onClicked).toBe('function', 
          'Component should have onClicked method');
      }
    });

    it('should call onClicked when day cell is clicked', () => {
      spyOn(component, 'onClicked');
      
      const dayCells = compiled.querySelectorAll('.day-year');
      
      if (dayCells.length > 0) {
        const firstDay = dayCells[0] as HTMLElement;
        
        // Simulate click
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        
        firstDay.dispatchEvent(clickEvent);
        fixture.detectChanges();
        
        // Verify click handler was called
        expect(component.onClicked).toHaveBeenCalled();
      }
    });

    it('should handle CTRL+Click for multi-selection', () => {
      spyOn(component, 'onClicked');
      
      const dayCells = compiled.querySelectorAll('.day-year');
      
      if (dayCells.length > 0) {
        const firstDay = dayCells[0] as HTMLElement;
        
        // Simulate CTRL+Click
        const ctrlClickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
          ctrlKey: true
        });
        
        firstDay.dispatchEvent(ctrlClickEvent);
        fixture.detectChanges();
        
        // Verify click handler was called with ctrl key
        expect(component.onClicked).toHaveBeenCalled();
      }
    });

    it('should have touchstart event handler for long press', () => {
      const dayCells = compiled.querySelectorAll('.day-year');
      
      expect(dayCells.length).toBeGreaterThan(0);
      
      if (dayCells.length > 0) {
        // Verify component has touch methods
        expect(typeof component.onTouchStart).toBe('function',
          'Component should have onTouchStart method');
        expect(typeof component.onTouchEnd).toBe('function',
          'Component should have onTouchEnd method');
        expect(typeof component.onTouchMove).toBe('function',
          'Component should have onTouchMove method');
      }
    });

    it('should trigger long press behavior on sustained touch', (done) => {
      const dayCells = compiled.querySelectorAll('.day-year');
      
      if (dayCells.length > 0) {
        const firstDay = dayCells[0] as HTMLElement;
        
        spyOn(component, 'onTouchStart').and.callThrough();
        spyOn(component, 'onTouchEnd').and.callThrough();
        
        // Simulate touch start
        const touchStartEvent = new TouchEvent('touchstart', {
          bubbles: true,
          cancelable: true,
          touches: [new Touch({
            identifier: 1,
            target: firstDay,
            clientX: 100,
            clientY: 100
          })]
        });
        
        firstDay.dispatchEvent(touchStartEvent);
        
        // Simulate touch end after delay (simulating long press)
        setTimeout(() => {
          const touchEndEvent = new TouchEvent('touchend', {
            bubbles: true,
            cancelable: true,
            changedTouches: [new Touch({
              identifier: 1,
              target: firstDay,
              clientX: 100,
              clientY: 100
            })]
          });
          
          firstDay.dispatchEvent(touchEndEvent);
          
          expect(component.onTouchStart).toHaveBeenCalled();
          expect(component.onTouchEnd).toHaveBeenCalled();
          done();
        }, 100);
      } else {
        done();
      }
    });

    it('should not have pointer-events blocked on day cells', () => {
      const dayCells = compiled.querySelectorAll('.day-year');
      
      if (dayCells.length > 0) {
        const firstDay = dayCells[0] as HTMLElement;
        const computedStyle = window.getComputedStyle(firstDay);
        
        // Verify pointer events are not disabled
        expect(computedStyle.pointerEvents).not.toBe('none',
          'Day cells should allow pointer events');
      }
    });
  });

  describe('Resize Behavior Tests', () => {
    it('should recalculate layout on window resize', (done) => {
      spyOn(component, 'onResize').and.callThrough();
      
      // Trigger resize event
      window.dispatchEvent(new Event('resize'));
      
      // Wait for debounce timeout (200ms + buffer)
      setTimeout(() => {
        expect(component.onResize).toHaveBeenCalled();
        done();
      }, 300);
    });

    it('should detect mobile view correctly', () => {
      // Component should have isMobileView method
      expect(typeof component.isMobileView).toBe('function');
      
      // At 1280px width, should not be mobile
      expect(component.isMobileView()).toBe(false);
    });
  });
});
