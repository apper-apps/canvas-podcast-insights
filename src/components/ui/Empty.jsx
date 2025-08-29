import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "There's nothing to show here yet.", 
  action,
  actionLabel = "Get started",
  icon = "Search"
}) => {
  return (
    <Card className="p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={icon} className="w-8 h-8 text-slate-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {title}
        </h3>
        
        <p className="text-slate-600 mb-6">
          {description}
        </p>
        
        {action && (
          <Button onClick={action} className="inline-flex items-center gap-2">
            <ApperIcon name="Plus" className="w-4 h-4" />
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Empty;