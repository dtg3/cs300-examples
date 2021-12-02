using UnityEngine;

public class AnimationStateController : MonoBehaviour
{
    private Animator animator;
    private float velocity = 0.0f;
    [SerializeField] private float acceleration = 0.1f;

    // For the oldBooleanAnimation
    private int isWalkingHash;
    private int isRunningHash;
    int velocityHash;
    // Start is called before the first frame update
    void Start()
    {
        animator = GetComponent<Animator>();

        // For the oldBooleanAnimation
        isWalkingHash = Animator.StringToHash("isWalking");
        isRunningHash = Animator.StringToHash("isRunning");
    }

    void oldBooleanAnimation(bool forwardPressed, bool runPressed)
    {
        bool isWalking = animator.GetBool(isWalkingHash);
        bool isRunning = animator.GetBool(isRunningHash);

        if (!isWalking && forwardPressed)
        {
            animator.SetBool("isWalking", true);
        }

        if (isWalking && !forwardPressed)
        {
            animator.SetBool("isWalking", false);
        }

        if (!isRunning && (forwardPressed &&  runPressed))
        {
            animator.SetBool(isRunningHash, true);
        }

        if (isRunning && (!forwardPressed || !runPressed)) {
            animator.SetBool(isRunningHash, false);
        }
    }

    // Update is called once per frame
    void Update()
    {
        bool forwardPressed = Input.GetKey("w");
        bool shiftPressed = Input.GetKey("left shift");
    }
}
