export interface VirtualClusterInstanceList {
    kind:       string;
    apiVersion: string;
    metadata:   VirtualClusterInstanceListMetadata;
    items:      Item[];
}

export interface Item {
    kind:       string;
    apiVersion: string;
    metadata:   ItemMetadata;
    spec:       Spec;
    status:     StatusClass;
}

export interface ItemMetadata {
    name:              string;
    namespace:         string;
    uid:               string;
    resourceVersion:   string;
    generation:        number;
    creationTimestamp: Date;
    finalizers:        string[];
    managedFields:     ManagedField[];
}

export interface ManagedField {
    manager:    string;
    operation:  string;
    apiVersion: string;
    time:       Date;
    fieldsType: string;
    fieldsV1:   FieldsV1;
}

export interface FieldsV1 {
    "f:metadata": FMetadata;
    "f:spec":     FSpec;
    "f:status":   FStatus;
}

export interface FMetadata {
    "f:finalizers": FFinalizers;
}

export interface FFinalizers {
    ".":                     SpaceObjects;
    "v:\"loft.sh/cleanup\"": SpaceObjects;
}

export interface SpaceObjects {
}

export interface FSpec {
    ".":             SpaceObjects;
    "f:clusterRef":  FClusterRef;
    "f:owner":       FOwner;
    "f:templateRef": FTemplateRef;
}

export interface FClusterRef {
    ".":                SpaceObjects;
    "f:cluster":        SpaceObjects;
    "f:namespace":      SpaceObjects;
    "f:virtualCluster": SpaceObjects;
}

export interface FOwner {
    ".":      SpaceObjects;
    "f:user": SpaceObjects;
}

export interface FTemplateRef {
    ".":      SpaceObjects;
    "f:name": SpaceObjects;
}

export interface FStatus {
    ".":                       SpaceObjects;
    "f:conditions":            SpaceObjects;
    "f:deployHash":            SpaceObjects;
    "f:phase":                 SpaceObjects;
    "f:serviceUID":            SpaceObjects;
    "f:spaceObjects":          SpaceObjects;
    "f:virtualCluster":        FVirtualCluster;
    "f:virtualClusterObjects": SpaceObjects;
}

export interface FVirtualCluster {
    ".":                  SpaceObjects;
    "f:accessPoint":      FAccessPoint;
    "f:helmRelease":      FHelmRelease;
    "f:instanceTemplate": FInstanceTemplateClass;
    "f:metadata":         SpaceObjects;
    "f:pro":              FPro;
    "f:spaceTemplate":    FInstanceTemplateClass;
}

export interface FAccessPoint {
    ".":         SpaceObjects;
    "f:ingress": FPro;
}

export interface FPro {
    ".":         SpaceObjects;
    "f:enabled": SpaceObjects;
}

export interface FHelmRelease {
    ".":        SpaceObjects;
    "f:chart":  FChart;
    "f:values": SpaceObjects;
}

export interface FChart {
    ".":         SpaceObjects;
    "f:version": SpaceObjects;
}

export interface FInstanceTemplateClass {
    ".":          SpaceObjects;
    "f:metadata": SpaceObjects;
}

export interface Spec {
    owner:       Owner;
    templateRef: TemplateRef;
    clusterRef:  ClusterRef;
}

export interface ClusterRef {
    cluster:        string;
    namespace:      string;
    virtualCluster: string;
}

export interface Owner {
    user: string;
}

export interface TemplateRef {
    name: string;
}

export interface StatusClass {
    phase:                 string;
    serviceUID:            string;
    deployHash:            string;
    conditions:            Condition[];
    virtualClusterObjects: SpaceObjects;
    spaceObjects:          SpaceObjects;
    virtualCluster:        VirtualCluster;
    sleepModeConfig:       SleepModeConfig;
    canUse:                boolean;
    canUpdate:             boolean;
    online:                boolean;
}

export interface Condition {
    type:               string;
    status:             StatusEnum;
    lastTransitionTime: Date;
}

export enum StatusEnum {
    True = "True",
}

export interface SleepModeConfig {
    metadata: SleepModeConfigMetadata;
    spec:     SpaceObjects;
    status:   SpaceObjects;
}

export interface SleepModeConfigMetadata {
    creationTimestamp: null;
}

export interface VirtualCluster {
    metadata:         SpaceObjects;
    instanceTemplate: InstanceTemplateClass;
    pro:              Pro;
    helmRelease:      HelmRelease;
    accessPoint:      AccessPoint;
    spaceTemplate:    InstanceTemplateClass;
}

export interface AccessPoint {
    ingress: Pro;
}

export interface Pro {
    enabled: boolean;
}

export interface HelmRelease {
    chart:  Chart;
    values: string;
}

export interface Chart {
    version: string;
}

export interface InstanceTemplateClass {
    metadata: SpaceObjects;
}

export interface VirtualClusterInstanceListMetadata {
    resourceVersion: string;
}
