import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { AppointmentsService } from '../api/OrganizerApiClient';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CustomDialogService } from '../custom-dialog/custom-dialog.service';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HomeComponent - Desktop View Rendering', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockAppointmentsService: jasmine.SpyObj<AppointmentsService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockBottomSheet: jasmine.SpyObj<MatBottomSheet>;
  let mockCustomDialogService: jasmine.SpyObj<CustomDialogService>;

  beforeEach(async () => {
    // Create mocks
    mockAppointmentsService = jasmine.createSpyObj('AppointmentsService', [
      'appointmentsGet',
      'calendarsGet',
      'upstreamEventTokensGet'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate'], { events: of() });
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockBottomSheet = jasmine.createSpyObj('MatBottomSheet', ['open']);
    mockCustomDialogService = jasmine.createSpyObj('CustomDialogService', ['showMessage']);

    // Setup default mock returns
    mockAppointmentsService.appointmentsGet.and.returnValue(of([]));
    mockAppointmentsService.calendarsGet.and.returnValue(of([]));
    mockAppointmentsService.upstreamEventTokensGet.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: AppointmentsService, useValue: mockAppointmentsService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatBottomSheet, useValue: mockBottomSheet },
        { provide: CustomDialogService, useValue: mockCustomDialogService },
        { provide: DomSanitizer, useValue: { sanitize: () => '', bypassSecurityTrustHtml: (val: string) => val } }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore child component errors for this test
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    
    // Set desktop viewport size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1280
    });
    
    fixture.detectChanges();
  });

  describe('Desktop Viewport Tests', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should render filters in single row on desktop (no wrapping)', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const filtersHeader = compiled.querySelector('.filters-header');
      
      expect(filtersHeader).toBeTruthy();
      
      // Check computed style to verify no wrapping
      if (filtersHeader) {
        const computedStyle = window.getComputedStyle(filtersHeader);
        // In desktop view, flex-wrap should be 'nowrap'
        expect(computedStyle.flexWrap).toBe('nowrap');
      }
    });

    it('should show desktop filters and hide mobile FAB button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      // Desktop filters should be visible
      const desktopFilters = compiled.querySelector('.desktop-only-filters');
      expect(desktopFilters).toBeTruthy();
      
      // Mobile FAB should be hidden (display: none via CSS at >= 768px)
      const mobileFab = compiled.querySelector('.mobile-filters-fab');
      if (mobileFab) {
        const computedStyle = window.getComputedStyle(mobileFab);
        expect(computedStyle.display).toBe('none');
      }
    });

    it('should have filter controls in desktop-only-filters section', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const desktopFilters = compiled.querySelector('.desktop-only-filters');
      
      expect(desktopFilters).toBeTruthy();
      
      // Verify calendar and customer filter templates are rendered
      if (desktopFilters) {
        // Should contain filter boxes or select elements
        const filterElements = desktopFilters.querySelectorAll('mat-form-field, mat-select, button');
        expect(filterElements.length).toBeGreaterThan(0);
      }
    });

    it('should verify filters stay inline without wrapping (width test)', (done) => {
      const compiled = fixture.nativeElement as HTMLElement;
      const filtersHeader = compiled.querySelector('.filters-header') as HTMLElement;
      
      if (filtersHeader) {
        // Get all filter child elements
        const children = Array.from(filtersHeader.children) as HTMLElement[];
        
        if (children.length > 1) {
          // Check that children are laid out horizontally (all on same row)
          const firstChildTop = children[0].getBoundingClientRect().top;
          
          // All children should have similar top position (same row)
          children.forEach((child) => {
            const childTop = child.getBoundingClientRect().top;
            const topDiff = Math.abs(childTop - firstChildTop);
            
            // Allow small margin for sub-pixel rendering differences
            expect(topDiff).toBeLessThan(5, 
              'All filters should be on the same row in desktop view');
          });
        }
      }
      
      done();
    });
  });

  describe('Component Method Tests', () => {
    it('should have clearCustomerFilter method that clears selected customers', () => {
      // Setup
      component.selectedCustomers = ['Customer1', 'Customer2'];
      spyOn(component, 'applyInMemoryFilters');
      
      // Execute
      component.clearCustomerFilter();
      
      // Verify
      expect(component.selectedCustomers).toEqual([]);
      expect(component.applyInMemoryFilters).toHaveBeenCalled();
    });

    it('should open mobile filters dialog when openMobileFilters is called', () => {
      // Execute
      component.openMobileFilters();
      
      // Verify
      expect(mockBottomSheet.open).toHaveBeenCalled();
    });
  });
});
