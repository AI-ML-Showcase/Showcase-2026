# Architecture Decision Records (ADRs)

Architecture Decision Records (ADRs) document significant architectural decisions made on this project, the context that influenced them, and the consequences of each decision.

## ADR Template

```markdown
# ADR-XXX: [Title]

## Status: [Proposed | Accepted | Deprecated | Superseded]

## Context
The issue or problem statement that led to this decision.

## Decision
The decision we have made.

## Rationale
Why we made this decision. What were the alternatives considered?

## Consequences
What will be the impact of this decision?
  - Positive consequences
  - Negative consequences (trade-offs)
  - Future considerations

## Alternatives Considered
1. Alternative A: [Description]
   - Pros: ...
   - Cons: ...

2. Alternative B: [Description]
   - Pros: ...
   - Cons: ...

## Related ADRs
- ADR-XXX: [Related decision]

## References
- [Link to documentation]
- [Link to proof of concept]
```

---

# ADR-001: Microservices Architecture with Bounded Contexts

## Status: Accepted

## Context
As the enterprise AI/ML platform grows, we need to support multiple teams working on different domains (fraud detection, recommendations, forecasting). Monolithic architecture would create deployment bottlenecks and tight coupling between teams.

## Decision
Adopt microservices architecture organized around business domains (bounded contexts from Domain-Driven Design). Each service owns its data and communicates via well-defined APIs.

## Rationale
- **Team autonomy**: Teams can deploy independently without coordinating
- **Technology flexibility**: Different services can use different tech stacks
- **Scalability**: Scale individual services based on demand
- **Resilience**: Failure in one service doesn't cascade to others
- **Proven pattern**: Industry standard for large-scale systems

## Consequences
- **Positive**:
  - Faster development cycles
  - Better fault isolation
  - Independent scaling
  - Clear team ownership
  
- **Negative**:
  - Distributed system complexity
  - Network latency between services
  - Data consistency challenges
  - Operational overhead increases

## Alternatives Considered
1. **Monolithic Architecture**: All services in single codebase
   - Pros: Simpler deployment, easier testing, better performance
   - Cons: Deployment bottlenecks, tight coupling, scaling inflexibility
   
2. **Serverless (FaaS)**: All functions as serverless
   - Pros: Automatic scaling, pay-per-execution, no ops overhead
   - Cons: Cold starts, vendor lock-in, not suitable for long-running ML jobs

## Related ADRs
- ADR-002: Event-Driven Communication
- ADR-003: API Gateway Pattern
- ADR-004: Service Mesh for Inter-Service Communication

---

# ADR-002: Event-Driven Communication with Event Sourcing

## Status: Accepted

## Context
With microservices, we need loose coupling between services. Direct API calls create tight coupling and cascading failures. We need eventual consistency for data across services.

## Decision
Use event-driven architecture with a central event bus (Kafka). Services publish domain events, and other services subscribe to relevant events.

## Rationale
- **Loose coupling**: Services don't need to know about each other
- **Scalability**: Event bus can handle high throughput
- **Traceability**: Complete audit trail of all business events
- **Replay capability**: Can replay events for debugging or recovery
- **Event sourcing**: Store all state changes as immutable events

## Consequences
- **Positive**:
  - Highly decoupled systems
  - Complete audit trail
  - Easy to add new consumers
  - Supports real-time analytics
  
- **Negative**:
  - Eventual consistency (not immediate)
  - Event schema evolution complexity
  - Higher operational complexity
  - Debugging distributed flows harder

## Implementation Details
```yaml
Event Bus: Apache Kafka
  - Topic per business domain
  - 7-day retention
  - Replication factor: 3
  - Partition key: Entity ID for ordering
  
Event Format: CloudEvents specification
  - Standard envelope with metadata
  - Schema registry for validation
  - Versioning for backward compatibility
  
Example Event:
  {
    \"specversion\": \"1.0\",
    \"type\": \"com.company.fraud.detection.alerts.created\",
    \"source\": \"fraud-detection-service\",
    \"id\": \"A234-1234-1234\",
    \"time\": \"2026-08-18T12:34:56Z\",
    \"datacontenttype\": \"application/json\",
    \"data\": {
      \"alertId\": \"ALT-123\",
      \"transactionId\": \"TXN-456\",
      \"severity\": \"high\",
      \"riskScore\": 0.92
    }
  }
```

## Alternatives Considered
1. **Synchronous REST APIs**: Services call each other directly
   - Pros: Simpler, immediate consistency
   - Cons: Tight coupling, cascading failures
   
2. **gRPC**: Synchronous protocol with better performance
   - Pros: Better performance, schema-driven
   - Cons: Still synchronous, tight coupling

## Related ADRs
- ADR-001: Microservices Architecture
- ADR-008: CQRS for Scalable Reads

---

# ADR-003: API Gateway Pattern with Kong

## Status: Accepted

## Context
With many microservices, clients need a single entry point. We need cross-cutting concerns like authentication, rate limiting, and request/response transformation centralized.

## Decision
Deploy Kong API Gateway as the single entry point for all external and some internal API traffic. Kong provides plugins for common concerns and is highly extensible.

## Rationale
- **Single entry point**: Clients don't need to know internal service locations
- **Cross-cutting concerns**: Centralized auth, rate limiting, logging
- **Extensibility**: Plugin ecosystem for custom logic
- **Cloud-native**: Container-native design, works well with Kubernetes

## Consequences
- **Positive**:
  - Centralized API management
  - Easy to add API policies
  - Reduces complexity in individual services
  - Monitoring and analytics in one place
  
- **Negative**:
  - Additional network hop
  - Potential bottleneck (mitigated with clustering)
  - Operational complexity
  - Plugin compatibility issues possible

## Architecture
```
Clients (Web, Mobile, Partners)
  ↓
Kong API Gateway (Load Balanced)
  ├─ Authentication (OAuth2, JWT)
  ├─ Rate Limiting (per client, per API)
  ├─ Request/Response Transformation
  ├─ Logging & Analytics
  └─ Service Routing
  ↓
Internal Microservices
```

## Related ADRs
- ADR-001: Microservices Architecture
- ADR-004: Service Mesh

---

# ADR-004: Service Mesh with Istio for Inter-Service Communication

## Status: Accepted

## Context
Microservices need reliable, secure communication. We need traffic management, security policies, and observability for service-to-service communication.

## Decision
Deploy Istio service mesh to manage all service-to-service communication. Istio provides traffic management, security, and observability without requiring application changes.

## Rationale
- **Transparent**: Sidecar proxy model, no application changes needed
- **Traffic management**: Canary deployments, circuit breaking, retries
- **Security**: mTLS encryption, authorization policies
- **Observability**: Automatic tracing, metrics, logging
- **Mature**: Widely adopted, strong community

## Consequences
- **Positive**:
  - Secure communication by default (mTLS)
  - Advanced traffic management
  - Cross-cutting observability
  - No application code changes
  
- **Negative**:
  - Additional resource overhead (sidecar per pod)
  - Operational complexity
  - Performance impact (small but measurable)
  - Learning curve steep

## Configuration Example
```yaml
# Virtual Service: Traffic routing and retries
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: churn-prediction-service
spec:
  hosts:
  - churn-prediction-service
  http:
  - match:
    - uri:
        prefix: \"/v2/\"
    route:
    - destination:
        host: churn-prediction-service
        port:
          number: 8080
        subset: v2
      weight: 90
    - destination:
        host: churn-prediction-service
        port:
          number: 8080
        subset: v1
      weight: 10
    retries:
      attempts: 3
      perTryTimeout: 2s
    timeout: 30s

# Destination Rule: Load balancing and circuit breaking
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: churn-prediction-service
spec:
  host: churn-prediction-service
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 100
        maxRequestsPerConnection: 2
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
```

## Related ADRs
- ADR-001: Microservices Architecture
- ADR-006: Container Orchestration with Kubernetes

---

# ADR-005: Data Architecture - Lakehouse with Delta Lake

## Status: Accepted

## Context
We need a unified data platform supporting both real-time analytics and ML workflows. Traditional data warehouses lack real-time capability, while data lakes lack ACID guarantees.

## Decision
Implement a lakehouse architecture using Delta Lake as the storage format. Delta Lake provides ACID transactions on top of object storage (S3).

## Rationale
- **Unified platform**: Single source for both batch and real-time data
- **ACID guarantees**: Data consistency and reliability
- **Performance**: Direct Spark integration, optimized queries
- **Cost-effective**: Object storage is cheaper than warehouse
- **Schema evolution**: Handles schema changes gracefully

## Consequences
- **Positive**:
  - Single platform for all data needs
  - ACID transactions for data quality
  - Excellent Spark integration
  - Lower cost than data warehouse
  
- **Negative**:
  - Learning curve for teams
  - Performance slower than optimized warehouses for analytics
  - Limited BI tool integration (improving)

## Architecture
```
Data Sources (APIs, Databases, Streams)
  ↓ (Spark, Python)
Raw Layer (Bronze) - Delta Lake
  - Immutable raw data
  - Ingestion metadata
  - 30-day retention
  ↓ (Spark Jobs)
Processed Layer (Silver) - Delta Lake
  - Cleaned, deduplicated data
  - Business transformations
  - Quality validated
  - 90-day retention
  ↓ (SQL, dbt)
Analytics Layer (Gold) - Delta Lake
  - Aggregated, denormalized data
  - Ready for analytics/ML
  - 7-year retention (compliance)
  ↓
Consumers (BI Tools, ML Models, Reports)
```

## Related ADRs
- ADR-009: Data Ingestion Patterns
- ADR-010: Feature Store Architecture

---

# ADR-006: Container Orchestration with Kubernetes

## Status: Accepted

## Context
We need to manage deployments of many containerized services across multiple servers. Manual management is error-prone and doesn't scale.

## Decision
Use Kubernetes (managed service: EKS/AKS/GKE) as the container orchestration platform. Kubernetes provides automatic deployment, scaling, and management of containerized applications.

## Rationale
- **Industry standard**: Most widely adopted container orchestration
- **Auto-scaling**: Automatically scales pods based on demand
- **Self-healing**: Restarts failed containers, replaces dead nodes
- **Rolling updates**: Zero-downtime deployments
- **Multi-cloud**: Works on AWS, Azure, GCP consistently

## Consequences
- **Positive**:
  - Proven, mature platform
  - Excellent community and tooling
  - Cost-effective resource utilization
  - Supports complex deployment strategies
  
- **Negative**:
  - Steep learning curve
  - Operational complexity
  - Debugging distributed issues harder
  - Resource overhead

## Cluster Configuration
```yaml
Cluster Size: 3-10 nodes (auto-scaling)
Node Type: t3.xlarge (4 vCPU, 16GB RAM)
Network: Private subnets with NAT gateway
Logging: CloudWatch (AWS) or Azure Monitor
Monitoring: Prometheus + Grafana
Security: Network policies, RBAC, pod security policies

Namespaces:
  - default: Core platform services
  - ml-inference: ML model serving
  - data-pipelines: Airflow, Spark jobs
  - monitoring: Prometheus, Grafana, Alertmanager
  - ingress: API Gateway (Kong)
```

## Related ADRs
- ADR-001: Microservices Architecture
- ADR-004: Service Mesh
- ADR-007: Infrastructure as Code

---

# ADR-007: Infrastructure as Code with Terraform

## Status: Accepted

## Context
Manual infrastructure management is error-prone, hard to reproduce, and doesn't scale. We need version-controlled, reproducible infrastructure.

## Decision
Use Terraform as the primary Infrastructure as Code tool. All infrastructure is defined in code, version controlled, and deployed through CI/CD.

## Rationale
- **Declarative**: Define desired state, Terraform handles implementation
- **Multi-cloud**: Works across AWS, Azure, GCP
- **Version control**: Infrastructure tracked like code
- **Reproducibility**: Identical deployments every time
- **Testability**: Can test infrastructure changes in staging

## Consequences
- **Positive**:
  - Infrastructure as documentation
  - Reproducible deployments
  - Easy rollback and disaster recovery
  - Team knowledge sharing
  
- **Negative**:
  - Learning curve for ops teams
  - Terraform state management complexity
  - Debugging diffs can be tricky

## Project Structure
```
infrastructure/terraform/
├── modules/
│   ├── kubernetes/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── networking/
│   ├── database/
│   ├── storage/
│   └── monitoring/
├── environments/
│   ├── dev/
│   │   └── terraform.tfvars
│   ├── staging/
│   │   └── terraform.tfvars
│   └── prod/
│       └── terraform.tfvars
├── main.tf
├── variables.tf
└── outputs.tf
```

## Related ADRs
- ADR-006: Container Orchestration
- ADR-012: GitOps for Deployments

---

# ADR-008: CQRS for ML Model Serving

## Status: Accepted

## Context
ML inference has different requirements than transactional operations. Read paths (inference) and write paths (training) have very different scaling needs.

## Decision
Apply CQRS (Command Query Responsibility Segregation) pattern: Separate read and write models for ML systems. Training pipeline writes to model store, inference reads from optimized model serving layer.

## Rationale
- **Scalability**: Inference scaled independently from training
- **Performance**: Read-optimized models (compiled, quantized)
- **Flexibility**: Can use different technologies for read vs write
- **Reliability**: Inference replicas independent of training

## Consequences
- **Positive**:
  - High inference throughput
  - Independent scaling
  - Better performance for inference
  
- **Negative**:
  - Model synchronization complexity
  - Consistency window (eventual consistency)

## Architecture
```
Write Path (Model Training):
  Training Data → Training Pipeline → Model Registry (MLflow)
  
Read Path (Inference):
  Model Registry → Model Serving Cache → KServe
  ↓
  REST API (load balanced)
  ↓
  Client Applications
  
Synchronization:
  - Model registry publishes events on new version
  - KServe pulls and deploys new model
  - Old replicas gradually drained during deployment
```

## Related ADRs
- ADR-002: Event-Driven Communication
- ADR-010: Feature Store Architecture

---

# ADR-009: Feature Store with Feast

## Status: Accepted

## Context
Features used in ML models need to be reused across training and serving. Without centralization, features are duplicated, leading to training-serving skew and code duplication.

## Decision
Implement a centralized feature store using Feast. Features are defined once and reused for both training and real-time inference.

## Rationale
- **Consistency**: Same features for training and serving
- **Reusability**: Features shared across multiple models
- **Point-in-time correctness**: Historical features for backtesting
- **Performance**: Caching layer for frequent features
- **Governance**: Centralized feature documentation

## Consequences
- **Positive**:
  - Prevents training-serving skew
  - Reduces feature engineering duplication
  - Enables faster model development
  
- **Negative**:
  - Additional infrastructure to manage
  - Feature store as critical infrastructure
  - Learning curve for teams

## Architecture
```yaml
Feature Store Layers:
  Offline Store: S3 + Redshift
    - Historical features for training
    - Point-in-time correct snapshots
    - 7-year retention (compliance)
    
  Online Store: Redis
    - Real-time features for inference
    - Sub-50ms latency SLO
    - 95% cache hit rate target
    
Feature Types:
  Real-time Features:
    - User activity (computed live)
    - Time-based features (current time)
    - SLO: < 50ms retrieval latency
    
  Batch Features:
    - Historical aggregations (computed daily)
    - User profiles (updated daily)
    - SLO: < 24 hour freshness
```

## Related ADRs
- ADR-005: Lakehouse Architecture
- ADR-008: CQRS for ML Serving
- ADR-010: Model Monitoring

---

# ADR-011: Frontend Framework - Angular LTS

## Status: Accepted

## Context
We need a modern, enterprise-grade frontend framework for the operations dashboard. Requirements include strong typing, large-scale app support, rich ecosystem, and long-term support.

## Decision
Use Angular LTS (Long-Term Support) as the primary frontend framework. Angular 18+ with standalone components and signals for reactive programming.

## Rationale
- **Enterprise-grade**: Built for large applications, strong governance
- **Strong typing**: TypeScript integration, catch errors at compile time
- **Long-term support**: LTS releases with 18-month support window
- **Rich ecosystem**: Angular Material, CDK, RxJS for complex scenarios
- **Testing**: Built-in testing tools (Jasmine, Karma)
- **Performance**: Ivy compiler, lazy loading, tree-shaking
- **Team expertise**: Organization has Angular experience

## Consequences
- **Positive**:
  - Strong type safety
  - Excellent debugging tools
  - Mature ecosystem
  - Long-term support and stability
  
- **Negative**:
  - Steeper learning curve than React
  - Larger bundle size (mitigated with lazy loading)
  - Opinionated structure (good for large teams)

## Alternatives Considered
1. **React**: More popular, simpler learning curve, but less opinionated
   - Pros: Flexible, large community, smaller core
   - Cons: More libraries to choose, less cohesive ecosystem
   
2. **Vue**: Easier to learn, smaller bundles
   - Pros: Gentle learning curve, lightweight
   - Cons: Smaller ecosystem, less suitable for large apps
   
3. **Svelte**: Modern, performant
   - Pros: Smallest bundle, most reactive
   - Cons: Smaller ecosystem, less enterprise adoption

## Related ADRs
- ADR-012: Component Architecture Pattern
- ADR-013: State Management Strategy

---

# ADR-012: Frontend Component Architecture

## Status: Accepted

## Context
Angular applications need clear structure for maintainability and scalability. We need to decide on component patterns, module organization, and code structure.

## Decision
Use standalone components with feature-based folder structure and container/presentational component pattern.

## Rationale
- **Standalone components**: Simplified module system, tree-shaking friendly
- **Feature-based structure**: Organize by business domain, not technical layer
- **Smart/dumb pattern**: Clear data flow, easier testing and reusability
- **Lazy loading by feature**: Load features on demand, faster initial load

## Architecture
```
src/
├── app/
│   ├── core/                    # Singleton services, guards, interceptors
│   │   ├── services/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── models/
│   │
│   ├── shared/                  # Shared components, pipes, directives
│   │   ├── components/
│   │   ├── pipes/
│   │   ├── directives/
│   │   └── models/
│   │
│   ├── features/                # Feature modules
│   │   ├── dashboard/
│   │   │   ├── containers/      # Smart components
│   │   │   ├── components/      # Dumb components
│   │   │   ├── services/
│   │   │   └── dashboard.routes.ts
│   │   │
│   │   ├── fraud-detection/
│   │   ├── recommendations/
│   │   └── forecasting/
│   │
│   ├── layout/                  # Layout components
│   │   ├── header/
│   │   ├── sidebar/
│   │   └── footer/
│   │
│   └── app.config.ts            # Angular 17+ standalone config
│
├── assets/                      # Static assets
└── styles/                      # Global styles
```

## Component Patterns
```typescript
// Smart Component (Container)
@Component({
  selector: 'app-dashboard-container',
  template: `<app-dashboard [data]="data$ | async"></app-dashboard>`,
  standalone: true,
  imports: [AsyncPipe, DashboardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardContainerComponent {
  data$ = this.service.getData();
  constructor(private service: DataService) {}
}

// Dumb Component (Presentational)
@Component({
  selector: 'app-dashboard',
  template: `<div>{{ data }}</div>`,
  standalone: true,
  inputs: ['data']
})
export class DashboardComponent {
  data: unknown;
}
```

## Consequences
- **Positive**:
  - Clear separation of concerns
  - Easier testing
  - Better code reusability
  - Scalable folder structure
  
- **Negative**:
  - More files initially
  - Requires discipline in pattern adherence

---

# ADR-013: State Management Strategy

## Status: Accepted

## Context
Complex dashboard requires managing application state across multiple features. Options range from simple services to full NgRx implementation.

## Decision
Use Angular Signals with a service-based state management approach. NgRx reserved for features with high complexity (fraud detection, real-time updates).

## Rationale
- **Signals**: Angular 16+ reactive primitive, simpler than RxJS observables
- **Composable**: Easy to combine state from multiple sources
- **Developer experience**: Shorter learning curve, less boilerplate
- **Performance**: Fine-grained reactivity, computed signals
- **Gradual adoption**: Can use NgRx later if needed

## Implementation Pattern
```typescript
// Shared State Service with Signals
@Injectable({ providedIn: 'root' })
export class StateService {
  // State signals
  customers = signal<Customer[]>([]);
  selectedCustomer = signal<Customer | null>(null);
  loading = signal(false);
  
  // Computed signals
  filteredCustomers = computed(() =>
    this.customers().filter(c => c.status === 'active')
  );
  
  // Effects for side effects
  constructor(private api: ApiService) {
    effect(() => {
      if (this.selectedCustomer()) {
        this.loadDetails();
      }
    });
  }
  
  // Mutations
  selectCustomer(id: string) {
    this.selectedCustomer.set(this.customers().find(c => c.id === id) || null);
  }
  
  loadCustomers() {
    this.loading.set(true);
    this.api.getCustomers().subscribe(customers => {
      this.customers.set(customers);
      this.loading.set(false);
    });
  }
}
```

## NgRx for Complex Features
Used for: Fraud detection service with complex workflows, real-time updates, time-travel debugging
```typescript
// Feature Store
export const fraudStore = signalStore(
  withState(initialState),
  withComputed(computedFunctions),
  withMethods(methods)
);
```

## Consequences
- **Positive**:
  - Simple, effective for most use cases
  - Reduced boilerplate
  - Easy to understand and maintain
  
- **Negative**:
  - Limited for very complex state flows
  - No time-travel debugging by default

---

# ADR-014: Styling and UI Framework

## Status: Accepted

## Context
Dashboard needs consistent, professional, accessible styling. Need to choose between Material Design, Tailwind, or custom styling.

## Decision
Use Angular Material for UI components and Tailwind CSS for utility-first styling and layout. Material themes customized for brand colors.

## Rationale
- **Angular Material**: 
  - Built for Angular
  - Accessibility-first (WCAG compliant)
  - Comprehensive component library
  - Professional appearance
  
- **Tailwind CSS**:
  - Utility-first approach
  - Smaller CSS bundle (tree-shaking)
  - Consistent design tokens
  - Rapid development

## Setup
```bash
# Install dependencies
ng add @angular/material
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Configuration
```typescript
// Material theme
@import '@angular/material/prebuilt-themes/indigo-pink.css';

// Material typography
@import '@angular/material/typography/all-typography.css';

// Tailwind
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Usage Pattern
```html
<!-- Material for complex components -->
<mat-card class="mb-4">
  <mat-card-header>
    <mat-card-title>Customer Health</mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <!-- Content -->
  </mat-card-content>
</mat-card>

<!-- Tailwind for layout and utility -->
<div class="grid grid-cols-3 gap-4">
  <div class="bg-white rounded-lg shadow">...</div>
</div>
```

## Consequences
- **Positive**:
  - Professional appearance
  - Accessibility built-in
  - Consistent styling
  - Rapid development with utilities
  
- **Negative**:
  - Larger initial bundle (mitigated with tree-shaking)
  - Learning curve for Tailwind

---

# ADR-015: Testing Strategy

## Status: Accepted

## Context
Enterprise application requires comprehensive testing. Need to define testing pyramid and tools.

## Decision
Implement three-tier testing strategy: Unit tests (Jasmine), Component tests (Jasmine + TestBed), E2E tests (Cypress).

## Testing Pyramid
```
        ▲
       /|\
      / | \
     /  |  \
    /   |   \  E2E Tests (10%)
   /    |    \  - User flows, critical paths
  /_____E2E__\
  |\          |
  | \        /  Component Tests (30%)
  |  \      /   - Components with inputs/outputs
  |   \    /    - User interactions
  |  C  \  /    - Async operations
  |___   \/
  |\ \  /\   Unit Tests (60%)
  | \ \/__\  - Services, pipes, utilities
  |  \      - Business logic
  | U  \    - Error handling
  |____\___
```

## Tools & Configuration
```typescript
// Jasmine + Karma for unit/component tests
// Cypress for E2E tests
// Istanbul for coverage reporting (target: >80%)

// Run tests
ng test                  # Unit + component tests
ng e2e                   # E2E tests
ng test --code-coverage  # Coverage report
```

## Testing Examples
```typescript
// Unit test - Service
describe('StateService', () => {
  let service: StateService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StateService]
    });
    service = TestBed.inject(StateService);
  });
  
  it('should select customer', () => {
    service.selectCustomer('123');
    expect(service.selectedCustomer()?.id).toBe('123');
  });
});

// Component test - Presentational component
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });
  
  it('should display customer data', () => {
    component.customer.set(mockCustomer);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('John Doe');
  });
});

// E2E test - User flow
describe('Dashboard Flow', () => {
  it('should load and display customer list', () => {
    cy.visit('/dashboard');
    cy.contains('Customers').should('be.visible');
    cy.get('[data-testid="customer-row"]').should('have.length.greaterThan', 0);
  });
});
```

## Code Coverage Standards
- Overall: > 80%
- Critical paths: > 95%
- UI components: > 70%

## Consequences
- **Positive**:
  - Comprehensive test coverage
  - Quick feedback on errors
  - Confidence in refactoring
  - Documentation via tests
  
- **Negative**:
  - Initial time investment
  - Maintenance overhead

## Related ADRs
- ADR-012: Component Architecture

---

# ADR-016: Build, Bundle, and Deployment

## Status: Accepted

## Context
Angular application needs optimized builds, efficient bundling, and reliable deployment strategy.

## Decision
Use Angular CLI build optimization with differential loading, lazy-loaded feature modules, and containerized deployment.

## Build Strategy
```typescript
// angular.json configuration
{
  "projects": {
    "dashboard": {
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/dashboard",
            "optimization": true,
            "sourceMap": false,
            "namedChunks": false,
            "aot": true,
            "extractLicenses": true,
            "vendorChunk": false,
            "buildOptimizer": true,
            "budgets": [
              {
                "type": "bundle",
                "name": "main",
                "baseline": "500kb",
                "warning": "600kb",
                "error": "750kb"
              }
            ]
          }
        }
      }
    }
  }
}
```

## Deployment
- **Build**: `ng build --configuration production`
- **Container**: Docker image with Nginx reverse proxy
- **Platform**: Kubernetes (existing infrastructure)
- **CDN**: CloudFront for static assets

## Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/dashboard /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Consequences
- **Positive**:
  - Optimized bundle size
  - Fast initial load
  - Efficient caching
  - Reliable deployments
  
- **Negative**:
  - Complex build configuration
  - Build time overhead

---

More ADRs to be added as project evolves. Last updated: 2026-08-18
