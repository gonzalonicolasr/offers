export class OfferDynamoDB {
  id: string;
  action: Action;
  channels: string[];
  description: string;
  icon: string;
  isActive: boolean;
  isConvergent: boolean;
  metrics: Metrics;
  ruleId: string;
  segmentsConfig: Record<string, SegmentConfig>;
  title: string;
  type: string;
  validity: Validity;

  static fromDynamoDBItem(item: any): OfferDynamoDB {
    return {
      id: item.id,
      action: item.action,
      channels: item.channels,
      description: item.description,
      icon: item.icon,
      isActive: item.is_active,
      isConvergent: item.is_convergent,
      metrics: item.metrics,
      ruleId: item.rule_id,
      segmentsConfig: item.segments_config,
      title: item.title,
      type: item.type,
      validity: item.validity,
    };
  }
}

export interface Action {
  redirect: string;
  type: string;
}

export interface Metrics {
  flow: string;
}

export interface SegmentConfig {
  position: number;
}

export interface Validity {
  from: string;
  to: string;
}
